import express from "express"
import dotenv from "dotenv";
import path from "path"

import { dbConnection } from "./config/db.config.js";
import { AppConfig } from "./config/app.config.js";
import { RoutesConfig } from "./config/routes.config.js";

// dotenv.config();
dotenv.config({ path: path.resolve('backend', './.env') });

const app = express();
const port = process.env.PORT || 5000; // Default to 5000 if not specified in env

// App config (including middleware)
AppConfig(app);

// API Routes
RoutesConfig(app);

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

// Database connection
dbConnection().then(() => {
    // Route Test
    app.get("/", (req, res) => {
        res.send("Server is running!");
    });

    // Start server
    app.listen(port, () => {
        console.log(`Listening: http://localhost:${port}`);
    });
}).catch(error => {
    console.error("Failed to connect to the database:", error);
});