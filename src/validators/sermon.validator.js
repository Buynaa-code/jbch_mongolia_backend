const Joi = require('joi');

const createSermonSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
  }),
  preacher: Joi.string().required().messages({
    'any.required': 'Preacher name is required',
  }),
  date: Joi.date().required().messages({
    'any.required': 'Sermon date is required',
  }),
  duration: Joi.number().integer().positive().allow(null),
  audioUrl: Joi.string().uri().allow(null, ''),
  videoUrl: Joi.string().uri().allow(null, ''),
  thumbnailUrl: Joi.string().uri().allow(null, ''),
  description: Joi.string().allow(''),
  bibleReference: Joi.string().allow(''),
  series: Joi.string().allow(null, ''),
  tags: Joi.array().items(Joi.string()).default([]),
  isFeatured: Joi.boolean().default(false),
});

const updateSermonSchema = Joi.object({
  title: Joi.string(),
  preacher: Joi.string(),
  date: Joi.date(),
  duration: Joi.number().integer().positive().allow(null),
  audioUrl: Joi.string().uri().allow(null, ''),
  videoUrl: Joi.string().uri().allow(null, ''),
  thumbnailUrl: Joi.string().uri().allow(null, ''),
  description: Joi.string().allow(''),
  bibleReference: Joi.string().allow(''),
  series: Joi.string().allow(null, ''),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
});

module.exports = {
  createSermonSchema,
  updateSermonSchema,
};
