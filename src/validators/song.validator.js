const Joi = require('joi');
const { SONG_GENRES } = require('../config/constants');

const createSongSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
  }),
  artist: Joi.string().default('Unknown'),
  album: Joi.string().allow(''),
  genre: Joi.string()
    .valid(...Object.values(SONG_GENRES))
    .default(SONG_GENRES.WORSHIP),
  lyrics: Joi.string().allow(''),
  lyricsMongolian: Joi.string().allow(''),
  audioUrl: Joi.string().uri().allow(null, ''),
  videoUrl: Joi.string().uri().allow(null, ''),
  coverImage: Joi.string().uri().allow(null, ''),
  duration: Joi.number().integer().positive().allow(null),
  key: Joi.string().allow(null, ''),
  tempo: Joi.number().integer().positive().allow(null),
  tags: Joi.array().items(Joi.string()).default([]),
  isFeatured: Joi.boolean().default(false),
});

const updateSongSchema = Joi.object({
  title: Joi.string(),
  artist: Joi.string(),
  album: Joi.string().allow(''),
  genre: Joi.string().valid(...Object.values(SONG_GENRES)),
  lyrics: Joi.string().allow(''),
  lyricsMongolian: Joi.string().allow(''),
  audioUrl: Joi.string().uri().allow(null, ''),
  videoUrl: Joi.string().uri().allow(null, ''),
  coverImage: Joi.string().uri().allow(null, ''),
  duration: Joi.number().integer().positive().allow(null),
  key: Joi.string().allow(null, ''),
  tempo: Joi.number().integer().positive().allow(null),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
});

module.exports = {
  createSongSchema,
  updateSongSchema,
};
