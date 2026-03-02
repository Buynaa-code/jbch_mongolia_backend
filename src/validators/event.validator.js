const Joi = require('joi');
const { EVENT_TYPES } = require('../config/constants');

const createEventSchema = Joi.object({
  title: Joi.string().max(200).required().messages({
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
  }),
  type: Joi.string()
    .valid(...Object.values(EVENT_TYPES))
    .default(EVENT_TYPES.OTHER),
  startDate: Joi.date().required().messages({
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.min': 'End date must be after start date',
    'any.required': 'End date is required',
  }),
  location: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().allow(''),
    coordinates: Joi.object({
      lat: Joi.number(),
      lng: Joi.number(),
    }),
  }).required(),
  image: Joi.string().uri().allow(null, ''),
  speaker: Joi.object({
    name: Joi.string(),
    title: Joi.string(),
    bio: Joi.string(),
    image: Joi.string().uri().allow(null, ''),
  }),
  capacity: Joi.number().integer().positive().allow(null),
  isFeatured: Joi.boolean().default(false),
});

const updateEventSchema = Joi.object({
  title: Joi.string().max(200),
  description: Joi.string(),
  type: Joi.string().valid(...Object.values(EVENT_TYPES)),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate')),
  location: Joi.object({
    name: Joi.string(),
    address: Joi.string().allow(''),
    coordinates: Joi.object({
      lat: Joi.number(),
      lng: Joi.number(),
    }),
  }),
  image: Joi.string().uri().allow(null, ''),
  speaker: Joi.object({
    name: Joi.string(),
    title: Joi.string(),
    bio: Joi.string(),
    image: Joi.string().uri().allow(null, ''),
  }),
  capacity: Joi.number().integer().positive().allow(null),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
};
