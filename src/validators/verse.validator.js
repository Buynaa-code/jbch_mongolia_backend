const Joi = require('joi');
const { VERSE_THEMES } = require('../config/constants');

const createVerseSchema = Joi.object({
  reference: Joi.string().required().messages({
    'any.required': 'Reference is required',
  }),
  book: Joi.string().required().messages({
    'any.required': 'Book name is required',
  }),
  chapter: Joi.number().integer().positive().required().messages({
    'any.required': 'Chapter is required',
  }),
  verseStart: Joi.number().integer().positive().required().messages({
    'any.required': 'Starting verse is required',
  }),
  verseEnd: Joi.number().integer().positive().allow(null),
  text: Joi.string().required().messages({
    'any.required': 'Verse text is required',
  }),
  textMongolian: Joi.string().allow(''),
  theme: Joi.string()
    .valid(...Object.values(VERSE_THEMES))
    .default(VERSE_THEMES.FAITH),
  reflection: Joi.string().allow(''),
});

const updateVerseSchema = Joi.object({
  reference: Joi.string(),
  book: Joi.string(),
  chapter: Joi.number().integer().positive(),
  verseStart: Joi.number().integer().positive(),
  verseEnd: Joi.number().integer().positive().allow(null),
  text: Joi.string(),
  textMongolian: Joi.string().allow(''),
  theme: Joi.string().valid(...Object.values(VERSE_THEMES)),
  reflection: Joi.string().allow(''),
  isActive: Joi.boolean(),
});

const setVerseOfWeekSchema = Joi.object({
  weekOf: Joi.date().required().messages({
    'any.required': 'Week date is required',
  }),
});

module.exports = {
  createVerseSchema,
  updateVerseSchema,
  setVerseOfWeekSchema,
};
