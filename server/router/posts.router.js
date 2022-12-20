import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { postsController, likesController } from '../controllers/index.js';

// middlewares added specific to this router

const router = express.Router();

router.get('/', postsController.getLatestsPosts);
router.post('/', authMiddleware(), postsController.createPost);
router.put('/:postId', authMiddleware(), postsController.editPost);
router.delete('/:postId', authMiddleware(), postsController.deletePost);

router.post('/:postId/like', authMiddleware(), likesController.like);
router.delete('/:postId/like', authMiddleware(), likesController.unlike);

export default router;