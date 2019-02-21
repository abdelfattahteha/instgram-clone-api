const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator/check');
const User = require('../models/user');
const bcrypt = require("bcryptjs")

const router = express.Router();


router.post('/signup', [
    body('firstname').isLength({min:4})
        .withMessage("Firstname should be at least 4 characters."),
    body('lastname').isLength({min:4})
        .withMessage("Lastname should be at least 4 characters."),
    body('email').isEmail().normalizeEmail()
        .withMessage("E-mail must be valid.")
        .custom( (value, {req}) => {
            return User.findOne({email: value})
            .then( user => {
                if (user) {
                    return Promise.reject("E-mail Already Exist.");
                }
            });
    }),
    body('password').trim()
        .isLength({min:6}).withMessage("Password must be at least 6 length"),
    
    body('confirmPassword').trim()
        .custom( (value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords don't match");
            }
            return true;
        })

] ,authController.signup);

router.post('/login', [
    body('email').isEmail().normalizeEmail()
        .withMessage("E-mail Not Valid!")
        .custom( (value, {req}) => {
            return User.findOne({email: value})
            .then( user => {
                if (!user) {
                    return Promise.reject("E-mail or Password not correct!");
                }
            })
        }),
    body('password').trim()
        .custom( async (value, {req}) => {
            const user = await User.findOne({email: req.body.email});
            // in social login and have no password 
            if (!user.password) {
                throw new Error("Login with your social provider");
            } else {
                const isEqual = await bcrypt.compare(value, user.password);
                if (!isEqual) {
                    throw new Error("E-mail or Password not correct!");
                }
            }
            
            return true;
        })
] , authController.login);

router.get('/checkemail/:email', authController.checkEmail);

router.post('/social-login',[
    body('email').isEmail().normalizeEmail()
    .withMessage("E-mail must be valid.")],
    
    authController.socialLogin);

module.exports = router;