import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { ProductValidation } from "../validation/product.validation.js";
import { ProductController } from "../controllers/product.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";
import { validateRequest } from "../middlewares/joiImageValidation.js";
import uploadToCloudinary from "../middlewares/cloudinary.middleware.js";

const productRouter = express.Router();

productRouter.post(
    "/",
    upload("products").single("image"),
    validateRequest,
    validate(ProductValidation.add),
    (req, res, next) => {
        uploadToCloudinary("products")(req, res, next);
    },
    ProductController.add
);

productRouter.patch(
    "/:slug",
    upload("products").single("image"),
    validateRequest,
    validate(ProductValidation.update),
    (req, res, next) => {
        if (req.body.image) {
            next()
        } else {
            uploadToCloudinary("products")(req, res, next);
        }
    },
    ProductController.update
);

productRouter.get(
    "/",
    validate(ProductValidation.getAll),
    ProductController.getAll
);

productRouter.get(
    "/:slug",
    validate(ProductValidation.getBySlug),
    ProductController.getBySlug
);

productRouter.delete(
    "/:id",
    validate(ProductValidation.delete),
    ProductController.delete
);

export default productRouter;