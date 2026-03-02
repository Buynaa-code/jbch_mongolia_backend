const mongoose = require('mongoose');
const { EVENT_TYPES } = require('../config/constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      default: EVENT_TYPES.OTHER,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      name: {
        type: String,
        required: [true, 'Location name is required'],
      },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    image: {
      type: String,
      default: null,
    },
    speaker: {
      name: String,
      title: String,
      bio: String,
      image: String,
    },
    capacity: {
      type: Number,
      default: null, // null means unlimited
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function () {
  return this.registeredUsers ? this.registeredUsers.length : 0;
});

// Virtual for availability
eventSchema.virtual('isAvailable').get(function () {
  if (!this.capacity) return true;
  return this.registeredUsers.length < this.capacity;
});

// Virtual for upcoming check
eventSchema.virtual('isUpcoming').get(function () {
  return this.startDate > new Date();
});

// Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ isActive: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
