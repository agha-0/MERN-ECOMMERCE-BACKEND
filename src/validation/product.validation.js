import Joi from "joi";

export const ProductValidation = {
  add: {
    body: Joi.object().keys({
      category: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      discounted_price: Joi.number(),
      quantity: Joi.number().integer().min(1).required(),
      description: Joi.string().required(),
      image: Joi.any().required()
    }),
  },
  getBySlug: {
    params: Joi.object().keys({
      slug: Joi.string().required(),
    }),
  },
  getAll: {
    params: Joi.object().keys({
      slug: Joi.string(),
      page: Joi.number(),
    }),
  },
  update: {
    params: Joi.object().keys({
      slug: Joi.string().required(),
    }),
    body: Joi.object().keys({
      category: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      discounted_price: Joi.number(),
      quantity: Joi.number().integer(),
      description: Joi.string().required(),
      image: Joi.any().required()
    }),
  },
  delete: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
};
