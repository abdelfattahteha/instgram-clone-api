const express = require('express');
const commentController = require('../controllers/comment');
const validObjectId = require('../middleware/validObjectId');
const isAuth = require('../middleware/isAuth');
const router = express.Router();


// comments
router.post('/' , isAuth, commentController.postComment);
router.delete('/:id', [isAuth , validObjectId] , commentController.deleteComment);
router.put('/:id', [isAuth , validObjectId] , commentController.editComment);

// // replies
// router.post('/replies' , isAuth, commentController.postReply);
// router.delete('/replies/:id', [isAuth , validObjectId] , commentController.deleteReply);
// router.put('/replies/:id', [isAuth , validObjectId] , commentController.editReply);

module.exports = router;