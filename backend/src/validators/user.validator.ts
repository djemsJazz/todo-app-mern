import Joi from 'joi';
import { string, validator } from './helpers';

const userCreateSchema =  Joi.object({
  firstName: string.required(),
  lastName: string.required(),
  email: string.email().required(),
  phoneNumber: string.required(),
  password: string.required()
});

export const userCreateValidator =  validator.body(userCreateSchema);
