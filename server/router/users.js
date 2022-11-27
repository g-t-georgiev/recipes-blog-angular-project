const express = await import('express');

const { authMiddleware } = await import('../middlewares/index.js');
const { usersController } = await import('../controllers/index.js');

// middlewares added specific to this router

const router = express.Router();

router.get('/auth', authMiddleware(false), usersController.authenticate);

router.get('/profile', authMiddleware(), usersController.getProfileInfo);
router.put('/profile', authMiddleware(), usersController.editProfileInfo);

router.get('/themes', authMiddleware(), usersController.getUserThemes);
router.get('/posts', authMiddleware(), usersController.getUserPosts);
router.get('/subscriptions', authMiddleware(), usersController.getUserSubscriptions);
router.get('/likes', authMiddleware(), usersController.getUserLikes);

export default router;