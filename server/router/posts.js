const express = await import('express');

const { authMiddleware } = await import('../middlewares/index.js');
const { postsController, likesController } = await import('../controllers/index.js');

// middlewares added specific to this router

const router = express.Router();

router.get('/', postsController.getLatestsPosts);
router.post('/', authMiddleware(), postsController.createPost);
router.put('/:postId', authMiddleware(), postsController.editPost);
router.delete('/:postId', authMiddleware(), postsController.deletePost);

router.post('/:postId/like', authMiddleware(), likesController.like);
router.delete('/:postId/like', authMiddleware(), likesController.unlike);

export default router;