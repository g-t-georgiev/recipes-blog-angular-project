import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { themesController, subscriptionsController } from '../controllers/index.js';

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