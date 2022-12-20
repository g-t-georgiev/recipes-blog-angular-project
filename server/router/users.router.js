import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { usersController } from '../controllers/index.js';

import { router as auth } from './auth.router.js';

const router = express.Router();

router.get('/auth', auth);

router.get('/profile', authMiddleware(), usersController.getProfileInfo);
router.put('/profile', authMiddleware(), usersController.editProfileInfo);

router.get('/themes', authMiddleware(), usersController.getUserThemes);
router.get('/posts', authMiddleware(), usersController.getUserPosts);
router.get('/subscriptions', authMiddleware(), usersController.getUserSubscriptions);
router.get('/likes', authMiddleware(), usersController.getUserLikes);

export default router;