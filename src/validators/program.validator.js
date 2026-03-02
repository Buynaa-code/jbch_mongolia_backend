const Joi = require('joi');
const { SERVICE_TYPES } = require('../config/constants');

const programItemSchema = Joi.object({
  time: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  speaker: Joi.string().allow(''),
  order: Joi.number().integer().default(0),
});

const createProgramSchema = Joi.object({
  weekOf: Joi.date().required().messages({
    'any.required': 'Week start date is required',
  }),
  dayOfWeek: Joi.number().integer().min(0).max(6).required().messages({
    'number.min': 'Day of week must be between 0-6',
    'number.max': 'Day of week must be between 0-6',
    'any.required': 'Day of week is required',
  }),
  serviceType: Joi.string()
    .valid(...Object.values(SERVICE_TYPES))
    .required()
    .messages({
      'any.required': 'Service type is required',
    }),
  title: Joi.string().required().messages({
    'any.required': 'Program title is required',
  }),
  theme: Joi.string().allow(''),
  items: Joi.array().items(programItemSchema).default([]),
  notes: Joi.string().allow(''),
});

const updateProgramSchema = Joi.object({
  weekOf: Joi.date(),
  dayOfWeek: Joi.number().integer().min(0).max(6),
  serviceType: Joi.string().valid(...Object.values(SERVICE_TYPES)),
  title: Joi.string(),
  theme: Joi.string().allow(''),
  items: Joi.array().items(programItemSchema),
  notes: Joi.string().allow(''),
  isActive: Joi.boolean(),
});

module.exports = {
  createProgramSchema,
  updateProgramSchema,
};
