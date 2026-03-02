const Verse = require('../models/Verse.model');
const User = require('../models/User.model');
const BaseController = require('./base/BaseController');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

class VerseController extends BaseController {
  constructor() {
    super(Verse, 'Verse');
    this.searchFields = ['reference', 'text', 'textMongolian'];
  }

  // @desc    Get verse of the week
  // @route   GET /api/verses/verse-of-week
  getVerseOfWeek = asyncHandler(async (req, res, next) => {
    const verse = await Verse.getVerseOfWeek();

    if (!verse) {
      return next(ApiError.notFound('No verse of the week set'));
    }

    ApiResponse.success(res, verse);
  });

  // @desc    Get all unique themes
  // @route   GET /api/verses/themes
  getThemes = asyncHandler(async (req, res, next) => {
    const themes = await Verse.distinct('theme', { isActive: true });
    ApiResponse.success(res, themes);
  });

  // @desc    Get verses by theme
  // @route   GET /api/verses/theme/:theme
  getByTheme = asyncHandler(async (req, res, next) => {
    const { theme } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { theme, isActive: true };

    const [verses, total] = await Promise.all([
      Verse.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Verse.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, verses, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Get verses by book
  // @route   GET /api/verses/book/:book
  getByBook = asyncHandler(async (req, res, next) => {
    const { book } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { book: new RegExp(book, 'i'), isActive: true };

    const [verses, total] = await Promise.all([
      Verse.find(filter)
        .sort({ chapter: 1, verseStart: 1 })
        .skip(skip)
        .limit(limit),
      Verse.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, verses, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Toggle favorite verse
  // @route   POST /api/verses/:id/favorite
  toggleFavorite = asyncHandler(async (req, res, next) => {
    const verse = await Verse.findById(req.params.id);

    if (!verse) {
      return next(ApiError.notFound('Verse not found'));
    }

    const userId = req.user._id;
    const isFavorited = verse.favoritedBy.includes(userId);

    if (isFavorited) {
      verse.favoritedBy = verse.favoritedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      await User.findByIdAndUpdate(userId, {
        $pull: { favoriteVerses: verse._id },
      });
    } else {
      verse.favoritedBy.push(userId);
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favoriteVerses: verse._id },
      });
    }

    await verse.save();

    ApiResponse.success(
      res,
      { isFavorited: !isFavorited },
      isFavorited ? 'Removed from favorites' : 'Added to favorites'
    );
  });

  // @desc    Set verse of the week
  // @route   PUT /api/verses/:id/set-verse-of-week
  setVerseOfWeek = asyncHandler(async (req, res, next) => {
    const { weekOf } = req.body;

    // Remove current verse of week for same week
    await Verse.updateMany(
      { isVerseOfWeek: true, weekOf: new Date(weekOf) },
      { isVerseOfWeek: false, weekOf: null }
    );

    const verse = await Verse.findByIdAndUpdate(
      req.params.id,
      { isVerseOfWeek: true, weekOf: new Date(weekOf) },
      { new: true }
    );

    if (!verse) {
      return next(ApiError.notFound('Verse not found'));
    }

    ApiResponse.success(res, verse, 'Verse of the week set successfully');
  });

  // Override create to add createdBy
  create = asyncHandler(async (req, res, next) => {
    const verse = await Verse.create({
      ...req.body,
      createdBy: req.user._id,
    });
    ApiResponse.created(res, verse, 'Verse created successfully');
  });
}

module.exports = new VerseController();
