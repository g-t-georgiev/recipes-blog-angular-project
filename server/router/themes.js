const express = await import('express');

const { authMiddleware } = await import('../middlewares/index.js');
const { themesController, subscriptionsController } = await import('../controllers/index.js');

// middlewares added specific to this router

const router = express.Router();

router.get('/', themesController.getThemes);
router.post('/', authMiddleware(), themesController.createTheme);

router.get('/:themeId', themesController.getTheme);
router.put('/:themeId', themesController.editTheme);
router.delete('/:themeId', themesController.deleteTheme);

router.post('/:themeId/subscribe', authMiddleware(), subscriptionsController.subscribe);
router.delete('/:themeId/subscribe', authMiddleware(), subscriptionsController.unsubscribe);

export default router;