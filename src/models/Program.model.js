const mongoose = require('mongoose');
const { SERVICE_TYPES, DAYS_OF_WEEK } = require('../config/constants');

const programItemSchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, 'Time is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  speaker: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
});

const programSchema = new mongoose.Schema(
  {
    weekOf: {
      type: Date,
      required: [true, 'Week start date is required'],
    },
    dayOfWeek: {
      type: Number,
      required: [true, 'Day of week is required'],
      min: 0,
      max: 6,
      enum: Object.values(DAYS_OF_WEEK),
    },
    serviceType: {
      type: String,
      enum: Object.values(SERVICE_TYPES),
      required: [true, 'Service type is required'],
    },
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
    },
    theme: {
      type: String,
      default: '',
    },
    items: [programItemSchema],
    notes: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient week/day queries
programSchema.index({ weekOf: 1, dayOfWeek: 1 });
programSchema.index({ serviceType: 1 });
programSchema.index({ isActive: 1 });

// Static method to get current week's program
programSchema.statics.getCurrentWeekPrograms = async function () {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return this.find({
    weekOf: { $gte: startOfWeek, $lt: endOfWeek },
    isActive: true,
  }).sort({ dayOfWeek: 1 });
};

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
