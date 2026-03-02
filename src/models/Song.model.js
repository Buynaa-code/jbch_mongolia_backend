const mongoose = require('mongoose');
const { SONG_GENRES } = require('../config/constants');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    artist: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    album: {
      type: String,
      default: '',
      trim: true,
    },
    genre: {
      type: String,
      enum: Object.values(SONG_GENRES),
      default: SONG_GENRES.WORSHIP,
    },
    lyrics: {
      type: String,
      default: '',
    },
    lyricsMongolian: {
      type: String,
      default: '',
    },
    audioUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    duration: {
      type: Number, // in seconds
      default: null,
    },
    key: {
      type: String, // Musical key (C, D, E, etc.)
      default: null,
    },
    tempo: {
      type: Number, // BPM
      default: null,
    },
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
    tags: [
      {
        type: String,
        trim: true,
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
songSchema.virtual('favoriteCount').get(function () {
  return this.favoritedBy ? this.favoritedBy.length : 0;
});

// Indexes
songSchema.index({ title: 'text', artist: 'text', lyrics: 'text' });
songSchema.index({ genre: 1 });
songSchema.index({ isFeatured: 1 });
songSchema.index({ playCount: -1 });
songSchema.index({ isActive: 1 });

// Static method to get popular songs
songSchema.statics.getPopular = async function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ playCount: -1 })
    .limit(limit);
};

// Static method to get featured songs
songSchema.statics.getFeatured = async function () {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 });
};

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
