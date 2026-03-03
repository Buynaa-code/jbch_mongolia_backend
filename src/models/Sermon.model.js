const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    preacher: {
      type: String,
      required: [true, 'Preacher name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Sermon date is required'],
    },
    duration: {
      type: Number, // in seconds
      default: null,
    },
    audioUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    bibleReference: {
      type: String, // e.g., "Иохан 3:16-21"
      default: '',
    },
    series: {
      type: String, // Sermon series name
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    playCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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

// Virtual for favorite count
sermonSchema.virtual('favoriteCount').get(function () {
  return this.favoritedBy ? this.favoritedBy.length : 0;
});

// Indexes
sermonSchema.index({ date: -1 });
sermonSchema.index({ preacher: 1 });
sermonSchema.index({ series: 1 });
sermonSchema.index({ isFeatured: 1 });
sermonSchema.index({ title: 'text', description: 'text', bibleReference: 'text' });

// Static methods
sermonSchema.statics.getRecent = async function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ date: -1 })
    .limit(limit);
};

sermonSchema.statics.getFeatured = async function () {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ date: -1 });
};

sermonSchema.statics.getBySeries = async function (series) {
  return this.find({ isActive: true, series })
    .sort({ date: 1 });
};

const Sermon = mongoose.model('Sermon', sermonSchema);

module.exports = Sermon;
