const express = require('express')
const router = express.Router();
const userController = require('../controllers/user/userController');
const resetPassword = require('../controllers/user/resetPassword')

//Signup and generate the activation link
router.post('/signup', userController.signup);

//Signin and generate JWT token
router.post('/signin', userController.signin);

//token generation and mail send
router.post('/forgot_password', resetPassword.sendToken);

//verfifying token and reset password
router.post('/reset_password/:token', resetPassword.verifyAndUpdatePassword);

//to get the ID of User
router.get('/getId', userController.getUserID);

module.exports = router;