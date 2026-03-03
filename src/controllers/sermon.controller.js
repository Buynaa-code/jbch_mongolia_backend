const Sermon = require('../models/Sermon.model');
const User = require('../models/User.model');
const BaseController = require('./base/BaseController');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

class SermonController extends BaseController {
  constructor() {
    super(Sermon, 'Sermon');
    this.searchFields = ['title', 'preacher', 'description', 'bibleReference'];
  }

  // @desc    Search sermons
  // @route   GET /api/sermons/search
  search = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return next(ApiError.badRequest('Search query is required'));
    }

    const filter = {
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { preacher: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { bibleReference: { $regex: q, $options: 'i' } },
      ],
    };

    const [sermons, total] = await Promise.all([
      Sermon.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Sermon.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, sermons, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Get recent sermons
  // @route   GET /api/sermons/recent
  getRecent = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const sermons = await Sermon.getRecent(limit);
    ApiResponse.success(res, sermons);
  });

  // @desc    Get featured sermons
  // @route   GET /api/sermons/featured
  getFeatured = asyncHandler(async (req, res, next) => {
    const sermons = await Sermon.getFeatured();
    ApiResponse.success(res, sermons);
  });

  // @desc    Get sermons by preacher
  // @route   GET /api/sermons/preacher/:name
  getByPreacher = asyncHandler(async (req, res, next) => {
    const { name } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      preacher: { $regex: name, $options: 'i' },
      isActive: true
    };

    const [sermons, total] = await Promise.all([
      Sermon.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Sermon.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, sermons, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Get sermons by series
  // @route   GET /api/sermons/series/:series
  getBySeries = asyncHandler(async (req, res, next) => {
    const { series } = req.params;
    const sermons = await Sermon.getBySeries(series);
    ApiResponse.success(res, sermons);
  });

  // @desc    Get all series names
  // @route   GET /api/sermons/series
  getAllSeries = asyncHandler(async (req, res, next) => {
    const series = await Sermon.distinct('series', {
      isActive: true,
      series: { $ne: null, $ne: '' }
    });
    ApiResponse.success(res, series);
  });

  // @desc    Toggle favorite sermon
  // @route   POST /api/sermons/:id/favorite
  toggleFavorite = asyncHandler(async (req, res, next) => {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return next(ApiError.notFound('Sermon not found'));
    }

    const userId = req.user._id;
    const isFavorited = sermon.favoritedBy.includes(userId);

    if (isFavorited) {
      sermon.favoritedBy = sermon.favoritedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      await User.findByIdAndUpdate(userId, {
        $pull: { favoriteSermons: sermon._id },
      });
    } else {
      sermon.favoritedBy.push(userId);
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favoriteSermons: sermon._id },
      });
    }

    await sermon.save();

    ApiResponse.success(
      res,
      { isFavorited: !isFavorited },
      isFavorited ? 'Removed from favorites' : 'Added to favorites'
    );
  });

  // @desc    Increment play count
  // @route   POST /api/sermons/:id/play
  incrementPlayCount = asyncHandler(async (req, res, next) => {
    const sermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!sermon) {
      return next(ApiError.notFound('Sermon not found'));
    }

    ApiResponse.success(res, { playCount: sermon.playCount });
  });

  // Override create to add createdBy
  create = asyncHandler(async (req, res, next) => {
    const sermon = await Sermon.create({
      ...req.body,
      createdBy: req.user._id,
    });
    ApiResponse.created(res, sermon, 'Sermon created successfully');
  });
}

module.exports = new SermonController();
