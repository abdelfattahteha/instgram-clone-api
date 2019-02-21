const express = require('express');
const userController = require('../controllers/user');
const validObjectId = require('../middleware/validObjectId');
const isAuth = require('../middleware/isAuth');
const multer = require('../middleware/upload-image');
const router = express.Router();

// get all users
router.get('/' , isAuth ,userController.getAllUsers);

//  Get user by id
router.get('/:id' , [isAuth,validObjectId] ,userController.getUser);

//  Get user posts
router.get('/:id/posts' , [isAuth,validObjectId] ,userController.getUserPosts);

//  change user image
router.post('/image' , 
    [isAuth, multer.single('image')] ,
    userController.changeUserImage);

module.exports = router;