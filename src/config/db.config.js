// db.config.js

import mongoose from "mongoose";
import { env } from "./env.config.js";

const dbUri = `mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

mongoose.set('strictQuery', false); // Optional: Configure Mongoose settings if necessary

export const dbConnection = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: env.DB_USERNAME, // Optional: Use only if authentication is needed
      pass: env.DB_PASSWORD, // Optional: Use only if authentication is needed
    });
    console.log("Database Connected.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
