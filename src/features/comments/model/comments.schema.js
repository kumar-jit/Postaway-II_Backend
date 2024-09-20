import mongoose from "mongoose";

export const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        require: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        require: true
    }
},{timestamps: true});

export const commentModel = mongoose.model("Comment", commentsSchema);