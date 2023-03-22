const express = require('express');
const router = express.Router()

const { signup, login, getUser, updateUser, forgotPassword } = require('../controllers/users')
const authMiddleware = require('../middleware/auth')

router.route('/signup').post(signup) //Sign up 
router.route('/login').post(login) //Login 
router.route('/').post(forgotPassword).get(authMiddleware, getUser) //get Reset Password code and get user with auth middleware
router.route('/reset-password/:id').put(updateUser) //reset password with code and user id 
router.route('/:email').get(getUser) //get user with email address
router.route('/update-user').put(authMiddleware, updateUser) //update user with auth middleware

module.exports = router