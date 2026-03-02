const Program = require('../models/Program.model');
const BaseController = require('./base/BaseController');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

class ProgramController extends BaseController {
  constructor() {
    super(Program, 'Program');
  }

  // @desc    Get current week's programs
  // @route   GET /api/programs/current-week
  getCurrentWeek = asyncHandler(async (req, res, next) => {
    const programs = await Program.getCurrentWeekPrograms();
    ApiResponse.success(res, programs);
  });

  // @desc    Get program by day of week
  // @route   GET /api/programs/day/:day
  getByDay = asyncHandler(async (req, res, next) => {
    const dayOfWeek = parseInt(req.params.day, 10);

    if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return next(ApiError.badRequest('Invalid day of week (must be 0-6)'));
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const programs = await Program.find({
      weekOf: { $gte: startOfWeek },
      dayOfWeek,
      isActive: true,
    }).sort({ createdAt: -1 });

    ApiResponse.success(res, programs);
  });

  // @desc    Get programs by service type
  // @route   GET /api/programs/service/:type
  getByServiceType = asyncHandler(async (req, res, next) => {
    const { type } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { serviceType: type, isActive: true };

    const [programs, total] = await Promise.all([
      Program.find(filter).sort({ weekOf: -1 }).skip(skip).limit(limit),
      Program.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, programs, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });

  // @desc    Clone program for next week
  // @route   POST /api/programs/:id/clone
  cloneForNextWeek = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return next(ApiError.notFound('Program not found'));
    }

    const nextWeek = new Date(program.weekOf);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Check if program already exists for next week
    const existing = await Program.findOne({
      weekOf: nextWeek,
      dayOfWeek: program.dayOfWeek,
      serviceType: program.serviceType,
    });

    if (existing) {
      return next(ApiError.conflict('Program already exists for next week'));
    }

    const newProgram = await Program.create({
      weekOf: nextWeek,
      dayOfWeek: program.dayOfWeek,
      serviceType: program.serviceType,
      title: program.title,
      theme: program.theme,
      items: program.items,
      notes: '',
      createdBy: req.user._id,
    });

    ApiResponse.created(res, newProgram, 'Program cloned for next week');
  });

  // Override create to add createdBy
  create = asyncHandler(async (req, res, next) => {
    const program = await Program.create({
      ...req.body,
      createdBy: req.user._id,
    });
    ApiResponse.created(res, program, 'Program created successfully');
  });
}

module.exports = new ProgramController();
