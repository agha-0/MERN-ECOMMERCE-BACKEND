import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

export const AppConfig = (app) => {
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
