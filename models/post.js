const mongoose = require('mongoose');
const commentSchema = require('./comment');
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String
    },
    comments: [
        {
            type: commentSchema
        }
    ],
    likes: [
        {
            type: new mongoose.Schema({
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                }
            })
        }
    ]

}, {timestamps: true});

module.exports = mongoose.model('Post' , postSchema);