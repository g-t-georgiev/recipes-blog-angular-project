import express from 'express';
import formidable from 'express-formidable';

import { authMiddleware } from '../middlewares/index.js';
import { usersController } from '../controllers/index.js';

import { formidableOptions } from '../config/formidable.config.js';

export const usersRouter = express.Router({ mergeParams: true, strict: true });

usersRouter.get('/check', authMiddleware(false), usersController.duplicateCrendetialsCheck);

usersRouter.get('/profile', authMiddleware(), usersController.getProfileInfo);
usersRouter.put('/profile', authMiddleware(), formidable(formidableOptions), usersController.editProfileInfo);

usersRouter.get('/themes', authMiddleware(), usersController.getUserThemes);
usersRouter.get('/posts', authMiddleware(), usersController.getUserPosts);
usersRouter.get('/subscriptions', authMiddleware(), usersController.getUserSubscriptions);
usersRouter.get('/likes', authMiddleware(), usersController.getUserLikes);