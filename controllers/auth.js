const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

// signup users
exports.signup = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation Errors!", data: errors.array()});
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);    
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword    
        });

        const newUser = await user.save();
        const token = newUser.generateAuthToken();
        res.status(201).json({
            message: 'User created successfully',
            user: newUser, 
            token: token
        });

    } catch (err) {
        next(err);
    }
}

//  login users
exports.login = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation Errors!", data: errors.array()});
    }
    try {
        const user = await User.findOne({email: req.body.email});
        const token = user.generateAuthToken();  // Generate JWT
        res.status(200).json({token: token, user:user});
    } catch (err) { 
        next(err) 
    };
}

//  login users
exports.socialLogin = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation Errors!", data: errors.array()});
    }
    try {
        const user = await User.findOne({email: req.body.email});

        // check of email found
        if (user) {
            const token = user.generateAuthToken();  // Generate JWT
            return res.status(200).json({token: token, user:user});
        } else {
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            });
            let newUser = await user.save();
            const token = newUser.generateAuthToken();  // Generate JWT
            return res.status(201).json({token: token, user:newUser});
        }

    } catch (err) { 
        next(err) 
    };
}

exports.checkEmail = async (req,res,next) => {
    let user = await User.findOne({email: req.params.email});
    let emailExist = false;
    if (user) {
        emailExist = true;
    }
    res.status(200).json({emailExist: emailExist});
}
