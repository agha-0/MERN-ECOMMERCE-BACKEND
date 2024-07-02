import express from "express";

// import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { ProductValidation } from "../validation/product.validation.js";
import { ProductController } from "../controllers/product.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";

const productRouter = express.Router();

productRouter.post(
    "/",
    //   isAuthenticated,
    upload("products").single("image"),
    validate(ProductValidation.add),
    ProductController.add
);

productRouter.put(
    "/:id",
    //   isAuthenticated,
    // upload("products").single("image"),
    validate(ProductValidation.update),
    ProductController.update
);

productRouter.get(
    "/",
    //   isAuthenticated,
    ProductController.getAll
);

productRouter.get(
    "/:slug",
    //   isAuthenticated,
    validate(ProductValidation.slug),
    ProductController.getBySlug
);

productRouter.delete(
    "/:id",
    // isAuthenticated,
    validate(ProductValidation.id),
    ProductController.delete
);

export default productRouter;