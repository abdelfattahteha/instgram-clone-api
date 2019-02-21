const Post = require('../models/post');
const resourceNotFound = require('../util/resourceNotFound');
const socket_io = require('../util/socket-io');

// Post new comment
exports.postComment = async (req,res,next) => {     // body(postId, content)
    try {
        const post = await Post.findById(req.body.postId);
        if (!post) {
            resourceNotFound(`No post found with ID = ${req.body.postId}`);
        }

        post.comments.push({
            user: req.userId,
            content: req.body.content
        });

        let newPost = await post.save();
        newPost = await Post.findById(newPost._id).populate('user comments.user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'addComment', post:newPost});

        res.status(201).json({message: "Comment Created Successfully" , post: newPost});
    } catch (err) {
        next(err);
    }
}


// Edit comment
exports.editComment = async (req,res,next) => {     // params(id) - body(postId, content)
    try {
        const post = await Post.findById(req.body.postId);
        if (!post) {
            resourceNotFound(`No post found with ID = ${req.body.postId}`);
        }

        const comment = await post.comments.id(req.params.id);
        if (!comment) {
            resourceNotFound(`No comment found with ID = ${req.params.id}`);
        }

        // CHECK IF UNAUTHORIZED USER
        if (post.user.toString() !== req.userId && comment.user.toString() !== req.userId) {
            const error = new Error("Not Authorized User");
            error.statusCode = 403;
            throw error;
        }

        comment.content = req.body.content;
        let editedPost = await post.save();
        editedPost = await Post.findById(editedPost._id).populate('user comments.user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'editComment', post:editedPost});

        res.status(200).json({message: "Comment Updated Successfully", post: editedPost});

    } catch (err) {
        next(err);
    }
}



// Delete comment
exports.deleteComment = async (req,res,next) => {     // params(id) - body(postId)
    try {
        const post = await Post.findById(req.body.postId);
        if (!post) {
            resourceNotFound(`No post found with ID = ${req.body.postId}`);
        }

        const comment = await post.comments.id(req.params.id);
        if (!comment) {
            resourceNotFound(`No comment found with ID = ${req.params.id}`);
        }

        // CHECK IF UNAUTHORIZED USER
        if (post.user.toString() !== req.userId && comment.user.toString() !== req.userId) {
            const error = new Error("Not Authorized User");
            error.statusCode = 403;
            throw error;
        }

        await comment.remove();
        let newPost = await post.save();
        newPost = await Post.findById(newPost._id).populate('user comments.user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'deleteComment', post:newPost});

        res.status(200).json({message: "Comment deleted successfully", post: newPost});

    } catch (err) {
        next(err);
    }
}


/* 
    Replies
*/
// Post new reply
// exports.postReply = async (req,res,next) => {       // body(postId, commentId, content)
//     try {
        
//         const post = await Post.findById(req.body.postId);
//         if (!post) {
//             resourceNotFound(`No post found with ID = ${req.body.postId}`);
//         }

//         const comment = await post.comments.id(req.body.commentId);
//         if (!comment) {
//             resourceNotFound(`No comment found with ID = ${req.body.commentId}`);
//         }

//         comment.replies.push({
//             user: req.userId,
//             content: req.body.content
//         });


//         await post.save();
//         res.status(201).json({message: "Reply Created Successfully", post: post});
//     } catch (err) {
//         next(err);
//     }
// }



// //  Edit reply
// exports.editReply = async (req,res,next) => {     // params(id) - body(postId, commentId, content)
//     try {

//         const post = await Post.findById(req.body.postId);
//         if (!post) {
//             resourceNotFound(`No post found with ID = ${req.body.postId}`);
//         }

//         const comment = await post.comments.id(req.body.commentId);
//         if (!comment) {
//             resourceNotFound(`No comment found with ID = ${req.body.commentId}`);
//         }

//         const reply = await comment.replies.id(req.params.id);
//         if (!reply) {
//             resourceNotFound(`No reply found with ID = ${req.params.id}`);
//         }

//         // CHECK IF UNAUTHORIZED USER
//         if (post.user.toString() !== req.userId && reply.user.toString() !== req.userId) {
//             const error = new Error("Not Authorized User");
//             error.statusCode = 403;
//             throw error;
//         }

//         reply.content = req.body.content;
//         await post.save();
//         res.status(200).json({message: "Reply Updated Successfully", post: post});

//     } catch (err) {
//         next(err);
//     }
// }

// //  delete reply
// exports.deleteReply = async (req,res,next) => {     // params(id) - body(postId, commentId)
//     try {

//         const post = await Post.findById(req.body.postId);
//         if (!post) {
//             resourceNotFound(`No post found with ID = ${req.body.postId}`);
//         }

//         const comment = await post.comments.id(req.body.commentId);
//         if (!comment) {
//             resourceNotFound(`No comment found with ID = ${req.body.commentId}`);
//         }

//         const reply = await comment.replies.id(req.params.id);
//         if (!reply) {
//             resourceNotFound(`No reply found with ID = ${req.params.id}`);
//         }

//         // CHECK IF UNAUTHORIZED USER
//         if (post.user.toString() !== req.userId && reply.user.toString() !== req.userId) {
//             const error = new Error("Not Authorized User");
//             error.statusCode = 403;
//             throw error;
//         }

//         await reply.remove();
//         await post.save();
//         res.status(200).json({message: "Reply Deleted Successfully", post: post});

//     } catch (err) {
//         next(err);
//     }
// }