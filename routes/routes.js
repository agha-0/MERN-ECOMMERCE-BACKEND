const express = require('express');
const router = express.Router()

const multer = require('multer');

const { signup, login, getUser, updateUser, forgotPassword, emailRegistration } = require('../controllers/users.controllers')
const authMiddleware = require('../middleware/auth')

const catagoryController = require("../controllers/catagories.controller");
const productController = require("../controllers/product.controller");
const { add_address, get_Address, delete_Address, update_Address } = require('../controllers/address.controller');


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


// User Auth Routes
router.route('/signup').post(signup) //Sign up 
router.route('/login').post(login) //Login 
router.route('/forget-password').post(forgotPassword) //get Reset Password code and get user with auth middleware
router.route('/get-user').get(authMiddleware, getUser) //get Reset Password code and get user with auth middleware
router.route('/reset-password/:id').put(updateUser) //reset password with code and user id 
router.route('/get-user/:email').get(getUser) //get user with email address
router.route('/update-user').put(authMiddleware, updateUser) //update user with auth middleware
router.route('/register-email').post(emailRegistration) //update user with auth middleware


// Category Routes
router.post("/catagory", catagoryController.create);
router.get("/catagory", catagoryController.findAll);
router.get("/catagory/:id", catagoryController.findOne);
router.put("/catagory/:id", catagoryController.update);
router.delete("/catagory/:id", catagoryController.delete);


// Products Routes
router.post("/product", productController.create);
router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.put("/product/:id", productController.update);
router.delete("/product/:id", productController.delete);


// Address Routes
router.route("/add_address").post(authMiddleware, add_address);
router.route("/get_address").get(authMiddleware, get_Address);
router.route("/delete_Address/:address_id").delete(authMiddleware, delete_Address);
router.route("/update_Address/:address_id").put(authMiddleware, update_Address);


module.exports = router
