import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './src/features/users/users.routes.js';
import {globalErrorHandaler} from './src/middlewares/errHandalerMiddleware.js';
import { invalidRoutesHandlerMiddleware } from './src/middlewares/invalideRoutes.middleware.js';
import postRouter from './src/features/post/post.routes.js';
// configure env file
dotenv.config();

export const app = express();

// for json body reader
app.use(express.json());
app.use(cors());

// all HTTP controller
app.use("/api/users", userRouter);
app.use("/api/posts",postRouter);


app.use(invalidRoutesHandlerMiddleware);
app.use(globalErrorHandaler);


