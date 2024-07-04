import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import util from 'util';

// Promisify fs.unlink for easier use in async functions
const unlinkFile = util.promisify(fs.unlink);

// Cloudinary configuration
cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: "deok9e4c3",
    api_key: "293785783928332",
    api_secret: "OdqRyMXLn8TnDprdOA2T76ePBWI",
    secure: true,
});

// Middleware to upload to Cloudinary with dynamic folder
const uploadToCloudinary = (folder) => async (req, res, next) => {
    if (!req.file) {
        return;
    }

    const filePath = req.file.path;

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder, // Use dynamic folder here
        });

        // Add Cloudinary URL to request body for further processing
        req.body.cloudinaryUrl = result.secure_url;

        // Optionally delete the local file
        await unlinkFile(filePath);
        next();
    } catch (error) {
        // console.error('Error uploading to Cloudinary:', error);
        return res.status(500).send('Failed to upload to Cloudinary.');
    }
};

export default uploadToCloudinary;
