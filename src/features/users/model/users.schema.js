import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { customErrorHandler } from "../../../middlewares/errHandalerMiddleware.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

// schrema decleration
export const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: { type: String, required: true, minlength: 2 },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    avatar: { type: String }, // URL for user avatar
    friends: [
      {
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        status: {
          type: String,
          enum: ["ReceiveRequest", "SendRequest", "Friend"],
          default: "ReceiveRequest",
        },
      },
    ],
    tokens: [{ token: { type: String } }],
    otp: { type: String },
    otpExpiry: { type: Date }
  },
  { timestamps: true }
);

// Token generation method
userSchema.methods.generateAuthToken = async function() {
  try {
    const token = jwt.sign({ _id: this._id.toString(), email: this.email }, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
  } catch (error) {
    throw new customErrorHandler(error.message, 500);
  }
};

userSchema.method.generateOtp = async function(otp) {
    try {
        const token = jwt.sign({ otp: otp, email: this.email }, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    } catch (error) {
        throw new ErrorHandler(500, error);
    }
}
// Password validation method
userSchema.methods.isPasswordMatch = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Password hashing middleware
userSchema.methods.encryptPassword = async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw new customErrorHandler(error.message, 500);
  }
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.otp;
  return user;
}

userSchema.methods.checkFriendshipStatus = function(friendId) {
    return this.friends.find( friend => friend.friendId == friendId);
}

// making unique id for friends
userSchema.index({ "friends.friendId": 1 }, { unique: true, partialFilterExpression: { "friends.friendId": { $exists: true, $ne: null } } });

export const userModel = mongoose.model("User", userSchema);
