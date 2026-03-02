const mongoose = require('mongoose');
const { VERSE_THEMES } = require('../config/constants');

const verseSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: [true, 'Reference is required'],
      trim: true,
    },
    book: {
      type: String,
      required: [true, 'Book name is required'],
      trim: true,
    },
    chapter: {
      type: Number,
      required: [true, 'Chapter is required'],
    },
    verseStart: {
      type: Number,
      required: [true, 'Starting verse is required'],
    },
    verseEnd: {
      type: Number,
      default: null, // null if single verse
    },
    text: {
      type: String,
      required: [true, 'Verse text is required'],
    },
    textMongolian: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      enum: Object.values(VERSE_THEMES),
      default: VERSE_THEMES.FAITH,
    },
    isVerseOfWeek: {
      type: Boolean,
      default: false,
    },
    weekOf: {
      type: Date,
      default: null, // Set when isVerseOfWeek is true
    },
    reflection: {
      type: String,
      default: '',
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
verseSchema.virtual('favoriteCount').get(function () {
  return this.favoritedBy ? this.favoritedBy.length : 0;
});

// Indexes
verseSchema.index({ book: 1 });
verseSchema.index({ theme: 1 });
verseSchema.index({ isVerseOfWeek: 1, weekOf: -1 });
verseSchema.index({ isActive: 1 });

// Static method to get current verse of the week
verseSchema.statics.getVerseOfWeek = async function () {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Find verse of week for current week
  let verse = await this.findOne({
    isVerseOfWeek: true,
    weekOf: { $gte: startOfWeek },
    isActive: true,
  });

  // If no verse set for this week, get most recent
  if (!verse) {
    verse = await this.findOne({
      isVerseOfWeek: true,
      isActive: true,
    }).sort({ weekOf: -1 });
  }

  return verse;
};

const Verse = mongoose.model('Verse', verseSchema);

module.exports = Verse;
