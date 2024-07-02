import Joi from "joi";

export const ProductValidation = {
  add: {
    body: Joi.object().keys({
      category: Joi.string().required(), // Assuming category is a string ID here
      name: Joi.string().required(),
      price: Joi.number().required(),
      discountedPrice: Joi.number(),
      quantity: Joi.number().integer().min(1).required(),
      description: Joi.string().required(),
    }),
    // files: Joi.object().keys({
    //     image: Joi.any().required().label('image'),
    // })
  },
  getBySlug: {
    params: Joi.object().keys({
      slug: Joi.string().required(),
    }),
  },
  update: {
    params: Joi.object().keys({
      slug: Joi.string().required(),
    }),
    body: Joi.object().keys({
      category: Joi.string(),
      name: Joi.string(),
      slug: Joi.string(),
      price: Joi.number(),
      discountedPrice: Joi.number(),
      image: Joi.string(),
      quantity: Joi.number().integer().min(0),
      description: Joi.string(),
    }).min(1), // Ensure at least one field is provided for update
  },
  delete: {
    params: Joi.object().keys({
      slug: Joi.string().required(),
    }),
  },
};
