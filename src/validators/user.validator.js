const Joi = require('joi');
const { ROLES } = require('../config/constants');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
  }),
  phone: Joi.string().allow('', null),
  avatar: Joi.string().uri().allow(null, ''),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required',
  }),
});

const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      'any.required': 'Role is required',
    }),
});

const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    'any.required': 'Status is required',
  }),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
};
