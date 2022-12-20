import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { usersController } from '../controllers/index.js';

import { authRouter } from './auth.router.js';

export const usersRouter = express.Router();

usersRouter.use('/auth', authRouter);
usersRouter
usersRouter.get('/profile', authMiddleware(), usersController.getProfileInfo);
usersRouter.put('/profile', authMiddleware(), usersController.editProfileInfo);
usersRouter
usersRouter.get('/themes', authMiddleware(), usersController.getUserThemes);
usersRouter.get('/posts', authMiddleware(), usersController.getUserPosts);
usersRouter.get('/subscriptions', authMiddleware(), usersController.getUserSubscriptions);
usersRouter.get('/likes', authMiddleware(), usersController.getUserLikes);