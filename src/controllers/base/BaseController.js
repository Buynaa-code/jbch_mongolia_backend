const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../middleware/asyncHandler');

class BaseController {
  constructor(Model, modelName = 'Resource') {
    this.Model = Model;
    this.modelName = modelName;
  }

  // Get all documents with pagination, filtering, sorting
  getAll = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    // Build filter from query params (excluding pagination/sort params)
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    const filterObj = { ...req.query };
    excludeFields.forEach((field) => delete filterObj[field]);

    // Handle search if provided
    let filter = { ...filterObj };
    if (req.query.search && this.searchFields) {
      filter.$or = this.searchFields.map((field) => ({
        [field]: { $regex: req.query.search, $options: 'i' },
      }));
      delete filter.search;
    }

    const [docs, total] = await Promise.all([
      this.Model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.Model.countDocuments(filter),
    ]);

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    ApiResponse.paginated(res, docs, pagination);
  });

  // Get single document by ID
  getById = asyncHandler(async (req, res, next) => {
    const doc = await this.Model.findById(req.params.id);

    if (!doc) {
      return next(ApiError.notFound(`${this.modelName} not found`));
    }

    ApiResponse.success(res, doc);
  });

  // Create new document
  create = asyncHandler(async (req, res, next) => {
    const doc = await this.Model.create(req.body);
    ApiResponse.created(res, doc, `${this.modelName} created successfully`);
  });

  // Update document by ID
  update = asyncHandler(async (req, res, next) => {
    const doc = await this.Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(ApiError.notFound(`${this.modelName} not found`));
    }

    ApiResponse.success(res, doc, `${this.modelName} updated successfully`);
  });

  // Delete document by ID
  delete = asyncHandler(async (req, res, next) => {
    const doc = await this.Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(ApiError.notFound(`${this.modelName} not found`));
    }

    ApiResponse.success(res, null, `${this.modelName} deleted successfully`);
  });

  // Soft delete (set isActive to false)
  softDelete = asyncHandler(async (req, res, next) => {
    const doc = await this.Model.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doc) {
      return next(ApiError.notFound(`${this.modelName} not found`));
    }

    ApiResponse.success(res, null, `${this.modelName} deactivated successfully`);
  });
}

module.exports = BaseController;
