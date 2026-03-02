const Song = require('../models/Song.model');
const User = require('../models/User.model');
const BaseController = require('./base/BaseController');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

class SongController extends BaseController {
  constructor() {
    super(Song, 'Song');
    this.searchFields = ['title', 'artist', 'lyrics'];
  }

  // @desc    Search songs
  // @route   GET /api/songs/search
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
        { artist: { $regex: q, $options: 'i' } },
        { lyrics: { $regex: q, $options: 'i' } },
      ],
    };

    const [songs, total] = await Promise.all([
      Song.find(filter).sort({ playCount: -1 }).skip(skip).limit(limit),
      Song.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, songs, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Get popular songs
  // @route   GET /api/songs/popular
  getPopular = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const songs = await Song.getPopular(limit);
    ApiResponse.success(res, songs);
  });

  // @desc    Get featured songs
  // @route   GET /api/songs/featured
  getFeatured = asyncHandler(async (req, res, next) => {
    const songs = await Song.getFeatured();
    ApiResponse.success(res, songs);
  });

  // @desc    Get songs by genre
  // @route   GET /api/songs/genre/:genre
  getByGenre = asyncHandler(async (req, res, next) => {
    const { genre } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { genre, isActive: true };

    const [songs, total] = await Promise.all([
      Song.find(filter).sort({ playCount: -1 }).skip(skip).limit(limit),
      Song.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, songs, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Toggle favorite song
  // @route   POST /api/songs/:id/favorite
  toggleFavorite = asyncHandler(async (req, res, next) => {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    const userId = req.user._id;
    const isFavorited = song.favoritedBy.includes(userId);

    if (isFavorited) {
      song.favoritedBy = song.favoritedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      await User.findByIdAndUpdate(userId, {
        $pull: { favoriteSongs: song._id },
      });
    } else {
      song.favoritedBy.push(userId);
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favoriteSongs: song._id },
      });
    }

    await song.save();

    ApiResponse.success(
      res,
      { isFavorited: !isFavorited },
      isFavorited ? 'Removed from favorites' : 'Added to favorites'
    );
  });

  // @desc    Increment play count
  // @route   POST /api/songs/:id/play
  incrementPlayCount = asyncHandler(async (req, res, next) => {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    ApiResponse.success(res, { playCount: song.playCount });
  });

  // Override create to add createdBy
  create = asyncHandler(async (req, res, next) => {
    const song = await Song.create({
      ...req.body,
      createdBy: req.user._id,
    });
    ApiResponse.created(res, song, 'Song created successfully');
  });
}

module.exports = new SongController();
