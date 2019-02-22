const Post = require('../models/post');
const User = require('../models/user');
const resourceNotFound = require('../util/resourceNotFound');
const clearImage = require('../util/clear-image');
const socket_io = require('../util/socket-io');


exports.addPost = async (req,res,next) => {     // body(content, imageUrl)
    
    // if post is empty
    if (!req.file && !req.body.content) {
        const error = new Error("Post is Empty");
        error.statusCode = 422;
        return next(error);
    }

    // handle image if found
    let imageUrl= undefined;
    if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/images/`;
        imageUrl = imageUrl + req.file.filename;
    }

    // handle post content if found
    let postContent= undefined;
    if (req.body.content) {
        postContent = req.body.content;
    }
    
    
    const post = new Post({
        user: req.userId,
        content: postContent,
        imageUrl: imageUrl
    });

    try {
        let newPost = await post.save();
        newPost = await Post.findById(newPost._id).populate('user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'create', post:newPost});
        
        res.status(201).json({message: "Post Created Successfully", post: newPost});
        
    } catch (err) {
        next(err);
    }
    
}

// Delete Post
exports.deletePost = async (req,res,next) => {      // params(id)
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            resourceNotFound(`No Post Found with ID = ${req.params.id}`);
        }

        // CHECK IF UNAUTHORIZED USER
        if (post.user.toString() !== req.userId) {
            const error = new Error("Not Authorized User");
            error.statusCode = 403;
            throw error;
        }

        if (post.imageUrl) {
            clearImage(post.imageUrl);
        }
        const deletedPost = await Post.findByIdAndRemove(req.params.id).populate('user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'delete', post:deletedPost});

        res.status(200).json({message: "Post Deleted Successfully",post: deletedPost});
    } catch (err) {
        next(err);
    }

}

// Update Post
exports.updatePost = async (req,res,next) => {      // params(id) - req.body
    try {

        // check Post
        const post = await Post.findById(req.params.id);
        if (!post) {
            resourceNotFound(`no post found with ID = ${req.params.id}`);
        }

        // CHECK IF UNAUTHORIZED USER
        if (post.user.toString() !== req.userId) {
            const error = new Error("Not Authorized User");
            error.statusCode = 403;
            throw error;
        }


        // handle image if found
        if (req.file) {
            clearImage(post.imageUrl);
            let imageUrl = `${req.protocol}://${req.get("host")}/images/`;
            post.imageUrl = imageUrl + req.file.filename;
        }

        // handle post content if found
        if (req.body.content) {
            post.content = req.body.content;
        } else {
            post.content = undefined;
        }

        let updatedPost = await post.save();
        updatedPost = await Post.findById(updatedPost._id).populate('user comments.user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'update', post:updatedPost});

        res.status(200).json({message: "Post Updated Successfully", post: updatedPost});    
    } catch (err) {
        next(err);
    }
}


// getAll Posts in home page
exports.getAllPosts = async (req,res,next) => {
    
    try {
        const posts = await Post.find().
        populate('user comments.user', '-password')
        .sort({createdAt: -1}).select('-updatedAt -__v');
        res.status(200).json({posts: posts});
    } catch (err) {
        next(err);
    }
    
}


// Get one Post
exports.getPost = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            resourceNotFound(`no post found with ID = ${req.params.id}`);
        }
        res.status(200).json({post: post});
    } catch (err) {
        next(err);
    }
}


/*  Likes   */
// Post Likes
exports.postLike = async (req,res,next) => {      // body(postId)
    try {

        const post = await Post.findById(req.body.postId);
        if (!post) {
            resourceNotFound(`no post found with ID = ${req.body.postId}`);
        }
        post.likes.push({
            user: req.userId
        });
        let likedPost = await post.save();
        likedPost = await Post.findById(likedPost._id).populate('user comments.user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'addLike', post:likedPost});

        res.status(200).json({message: "Like Created Successfully", post: likedPost});
    } catch (err) {
        next(err);
    }

}


// delete Likes
exports.deleteLike = async (req,res,next) => {      // params(id) - body(postId)
    try {
        const post = await Post.findById(req.body.postId);
        if (!post) {
            resourceNotFound(`No Post Found with ID = ${req.body.postId}`);
        }

        
        const like = await post.likes.id(req.params.id);
        
        // CHECK IF UNAUTHORIZED USER
        if (like.user.toString() !== req.userId) {
            const error = new Error("Not Authorized User");
            error.statusCode = 403;
            throw error;
        }

        await like.remove();
        let likedPost = await post.save();
        likedPost = await Post.findById(likedPost._id).populate('user comments.user', '-password');

        // using web socket
        socket_io.getIO().emit('posts', {action: 'deleteLike', post:likedPost});

        res.status(200).json({message: "Like Deleted Successfully", post: likedPost});
    } catch (err) {
        next(err);
    }

}



