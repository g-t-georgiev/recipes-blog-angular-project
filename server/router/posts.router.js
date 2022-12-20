import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { postsController, likesController } from '../controllers/index.js';

export const postsRouter = express.Router();

postsRouter.get('/', postsController.getLatestsPosts);
postsRouter.post('/', authMiddleware(), postsController.createPost);
postsRouter.put('/:postId', authMiddleware(), postsController.editPost);
postsRouter.delete('/:postId', authMiddleware(), postsController.deletePost);

postsRouter.post('/:postId/like', authMiddleware(), likesController.like);
postsRouter.delete('/:postId/like', authMiddleware(), likesController.unlike);