const express = require('express');
const postController = require('../controllers/post');
const validObjectId = require('../middleware/validObjectId');
const isAuth = require('../middleware/isAuth');
const multer = require('../middleware/upload-image');
const router = express.Router();

// posts
router.post('/' , [isAuth , multer.single('image')] ,postController.addPost);
router.delete('/:id', [isAuth, validObjectId] , postController.deletePost);
router.put('/:id', [isAuth, validObjectId, multer.single('image')] , postController.updatePost);
router.get('/' , isAuth ,postController.getAllPosts);
router.get('/:id', [isAuth, validObjectId] , postController.getPost);

// likes
router.post('/likes', isAuth , postController.postLike);
router.delete('/likes/:id', [isAuth, validObjectId] , postController.deleteLike);

module.exports = router;