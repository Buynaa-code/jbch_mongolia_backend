const Event = require('../models/Event.model');
const User = require('../models/User.model');
const BaseController = require('./base/BaseController');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

class EventController extends BaseController {
  constructor() {
    super(Event, 'Event');
    this.searchFields = ['title', 'description'];
  }

  // @desc    Get upcoming events
  // @route   GET /api/events/upcoming
  getUpcoming = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 10;

    const events = await Event.find({
      startDate: { $gt: new Date() },
      isActive: true,
    })
      .sort({ startDate: 1 })
      .limit(limit);

    ApiResponse.success(res, events);
  });

  // @desc    Get featured events
  // @route   GET /api/events/featured
  getFeatured = asyncHandler(async (req, res, next) => {
    const events = await Event.find({
      isFeatured: true,
      isActive: true,
      startDate: { $gt: new Date() },
    }).sort({ startDate: 1 });

    ApiResponse.success(res, events);
  });

  // @desc    Get events by type
  // @route   GET /api/events/type/:type
  getByType = asyncHandler(async (req, res, next) => {
    const { type } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { type, isActive: true };

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ startDate: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, events, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Register for event
  // @route   POST /api/events/:id/register
  registerForEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(ApiError.notFound('Event not found'));
    }

    if (!event.isActive) {
      return next(ApiError.badRequest('Event is not active'));
    }

    if (event.startDate < new Date()) {
      return next(ApiError.badRequest('Event has already started'));
    }

    if (event.capacity && event.registeredUsers.length >= event.capacity) {
      return next(ApiError.badRequest('Event is full'));
    }

    if (event.registeredUsers.includes(req.user._id)) {
      return next(ApiError.conflict('Already registered for this event'));
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    // Also add to user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { registeredEvents: event._id },
    });

    ApiResponse.success(res, { event }, 'Successfully registered for event');
  });

  // @desc    Unregister from event
  // @route   DELETE /api/events/:id/register
  unregisterFromEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(ApiError.notFound('Event not found'));
    }

    if (!event.registeredUsers.includes(req.user._id)) {
      return next(ApiError.badRequest('Not registered for this event'));
    }

    event.registeredUsers = event.registeredUsers.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await event.save();

    // Also remove from user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { registeredEvents: event._id },
    });

    ApiResponse.success(res, null, 'Successfully unregistered from event');
  });

  // Override create to add createdBy
  create = asyncHandler(async (req, res, next) => {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    ApiResponse.created(res, event, 'Event created successfully');
  });
}

module.exports = new EventController();
