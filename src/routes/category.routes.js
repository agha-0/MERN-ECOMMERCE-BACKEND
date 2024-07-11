import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { CategoryValidation } from "../validation/category.validation.js";
import { CategoryController } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  validate(CategoryValidation.add),
  CategoryController.add
);

categoryRouter.put(
  "/:id",
  validate(CategoryValidation.update),
  CategoryController.update
);

categoryRouter.get(
  "/",
  CategoryController.getAll
);

categoryRouter.get(
  "/:id",
  validate(CategoryValidation.id),
  CategoryController.getById
);

categoryRouter.delete(
  "/:id",
  validate(CategoryValidation.id),
  CategoryController.delete
);

export default categoryRouter;