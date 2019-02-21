const Post = require('../models/post');
const User = require('../models/user');
const resourceNotFound = require('../util/resourceNotFound');


exports.getAllUsers = async (req,res,next) => {    
    try {
        const users = await User.find().select('-password -__v');
        res.status(200).json({users: users});
    } catch (err) {
        next(err);
    }
    
}


exports.getUser = async (req,res,next) => {    // params(id)
    try {
        const user = await User.findOne({_id: req.params.id}).select('-password -__v');
        if (!user) resourceNotFound(`No User Found With ID = ${req.params.id}`);
        res.status(200).json({user: user});
    } catch (err) {
        next(err);
    }
    
}



//  Get User Posts
exports.getUserPosts = async (req,res,next) => {    // params(id)
    try {
        const posts = await Post.find({user: req.params.id}).populate('user comments.user', '-password')
        .select('-updatedAt -__v').sort({createdAt: -1});
        res.status(200).json({posts: posts});
    } catch (err) {
        next(err);
    }
    
}

//   change user image 
exports.changeUserImage = async (req,res,next) => {       // image - file
    if (!req.file) {
        const error = new Error("No Image Provided");
        error.statusCode = 422;
        return next(error);
    }

    try {
        const imageUrl = `${req.protocol}://${req.get("host")}/images/`;
        const user = await User.findById(req.userId);
        user.imageUrl = imageUrl + req.file.filename;
        let updatedUser = await user.save();
        res.status(200).json({
            message: "Image Changed Successfully", 
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                imageUrl: updatedUser.imageUrl
            }
        });
    } catch (err) {
        next(err);
    }


}







