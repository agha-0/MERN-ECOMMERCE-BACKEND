import multer from 'multer';
import fs from 'fs';

// Function to dynamically set the destination path
const dynamicDestination = (subfolder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = `uploads/${subfolder}`;
            // Check if the directory exists, create it if not
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true creates nested directories if they don't exist
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
};

// const fileFilter = (req, file, cb) => {
//     console.log(req,file)
//     const validExts = ['.png', '.jpg', '.jpeg'];
//     const fileExt = path.extname(file.originalname).toLowerCase();

//     if (!validExts.includes(fileExt)) {
//         return cb(new Error('Invalid file type. Only .png, .jpg, and .jpeg formats are allowed.'));
//     }

//     cb(null, true);
// };

// Configure multer with storage and file filter
const upload = (subfolder) => multer({
    storage: dynamicDestination(subfolder),
    // fileFilter: fileFilter,
    // limits: {
    //     fileSize: 5248576 
    // }
});

export default upload