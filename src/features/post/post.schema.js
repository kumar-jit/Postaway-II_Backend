
import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        require: true
    },
    image:{
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},{timestamps: true});

postSchema.methods.isOwner = function (user){
    return this.owner.equals(user._id);
}

export const postModel = mongoose.model('Post', postSchema);