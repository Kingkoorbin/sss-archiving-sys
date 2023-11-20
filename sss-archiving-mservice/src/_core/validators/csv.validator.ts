import Joi from 'joi';

export const validateGeneratePdfBody = (body: any) => {
  const { error } = Joi.object({
    array: Joi.array().required(),
  }).validate(body);

  return error;
};