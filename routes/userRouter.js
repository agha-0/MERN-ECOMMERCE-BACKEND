const express = require('express');
const router = express.Router()

const multer = require('multer');

const { signup, login, getUser, updateUser, forgotPassword, emailRegistration } = require('../controllers/controllers.users')
const authMiddleware = require('../middleware/auth')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profile_pic');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.mimetype.split('image/').join('.'));
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});



router.route('/signup').post(signup) //Sign up 
router.route('/login').post(login) //Login 
router.route('/forget-password').post(forgotPassword) //get Reset Password code and get user with auth middleware
router.route('/get-user').get(authMiddleware, getUser) //get Reset Password code and get user with auth middleware
router.route('/reset-password/:id').put(updateUser) //reset password with code and user id 
router.route('/get-user/:email').get(getUser) //get user with email address
router.route('/update-user').put(authMiddleware, updateUser) //update user with auth middleware
router.route('/register-email').post(emailRegistration) //update user with auth middleware

module.exports = router
