import dotenv from "dotenv";

dotenv.config();

export const env = {
    //Port
    PORT: process.env.PORT || 5000,

    //Database
    DB_NAME: "ecommerce",
    DB_USERNAME: "Furnitea", // Leave empty if not using authentication
    DB_PASSWORD: "XYC1HESyquqAlmI0", // Leave empty if not using authentication
    DB_HOST: "127.0.0.1", // Assuming you are running MongoDB locally
    DB_PORT: 27017, // Default MongoDB port

    //Base URI
    BASE_URL: process.env.BASE_URL,
};
