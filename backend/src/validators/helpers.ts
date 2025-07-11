import  Joi from 'joi';
import ExpressJoiValidation from 'express-joi-validation';

export const validator = ExpressJoiValidation.createValidator({ passError: true });

export const string = Joi.string().trim();
export const number = Joi.number();
export const boolean = Joi.bool();
export const date = Joi.date();
export const uri = Joi.string().uri();
export const array = Joi.array();
export const object = Joi.object();
