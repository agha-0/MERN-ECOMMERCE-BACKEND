import express from "express";
// import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { CategoryValidation } from "../validation/category.validation.js";
import { CategoryController } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  //   isAuthenticated,
  // validate(CategoryValidation.add),
  CategoryController.add
);

categoryRouter.put(
  "/:id",
  //   isAuthenticated,
  validate(CategoryValidation.update),
  CategoryController.update
);

categoryRouter.get(
  "/",
  //   isAuthenticated,
  CategoryController.getAll
);

categoryRouter.get(
  "/:id",
  //   isAuthenticated,
  validate(CategoryValidation.id),
  CategoryController.getById
);

categoryRouter.delete(
  "/:id",
  // isAuthenticated,
  validate(CategoryValidation.id),
  CategoryController.delete
);

export default categoryRouter;