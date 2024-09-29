import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import userRouter from './src/features/users/routers/users.routes.js';
import postRouter from './src/features/post/router/post.routes.js';
import commetnsRouter from './src/features/comments/router/comments.routes.js';
import friendsManagementRouter from './src/features/users/routers/friends.routes.js';
import likesRouter from './src/features/post/router/likes.routes.js';
import resetInfoRouter from './src/features/users/routers/resetInfo.routes.js';

import { errorHandlerMiddleware } from './src/middlewares/errHandalerMiddleware.js';
import { invalidRoutesHandlerMiddleware } from './src/middlewares/invalideRoutes.middleware.js';

import apiDocs from './swaggerDocument.json' assert {type: 'json'}



// configure env file
dotenv.config();

export const app = express();

// for json body reader
app.use(express.json());
app.use(cors({
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  }));

// api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

// all HTTP controller
app.use("/api/users", userRouter);
app.use("/api/posts",postRouter);
app.use("/api/comments",commetnsRouter);
app.use("/api/friends",friendsManagementRouter);
app.use("/api/likes",likesRouter);
app.use("/api/otp",resetInfoRouter);

app.use(invalidRoutesHandlerMiddleware);
app.use(errorHandlerMiddleware);