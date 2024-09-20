import { addPost, getAllPosts, getPostDetails, getUserPosts, deletePost, updatePost } from '../controller/post.controller.js';
import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from 'express';
