import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './src/features/users/routers/users.routes.js';
import postRouter from './src/features/post/router/post.routes.js';
import commetnsRouter from './src/features/comments/router/comments.routes.js';
import friendsManagementRouter from './src/features/users/routers/friends.routes.js';
import likesRouter from './src/features/post/router/likes.routes.js';

import {errorHandlerMiddleware} from './src/middlewares/errHandalerMiddleware.js';
import { invalidRoutesHandlerMiddleware } from './src/middlewares/invalideRoutes.middleware.js';

// configure env file
dotenv.config();

export const app = express();

// for json body reader
app.use(express.json());
app.use(cors());

// all HTTP controller
app.use("/api/users", userRouter);
app.use("/api/posts",postRouter);
app.use("/api/comments",commetnsRouter);
app.use("/api/friends",friendsManagementRouter);
app.use("/api/likes/",likesRouter);

app.use(invalidRoutesHandlerMiddleware);
app.use(errorHandlerMiddleware);