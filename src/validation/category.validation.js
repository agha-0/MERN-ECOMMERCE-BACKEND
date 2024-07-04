import Joi from "joi";

export const CategoryValidation = {
  add: {
    body: Joi.object().keys({
      name: Joi.string().required()
    }),
  },
  id: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  update: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().required()
    }),
  },
}