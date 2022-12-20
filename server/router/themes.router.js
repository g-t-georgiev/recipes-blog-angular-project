import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { themesController, subscriptionsController } from '../controllers/index.js';

export const themesRouter = express.Router();

themesRouter.get('/', themesController.getThemes);
themesRouter.post('/', authMiddleware(), themesController.createTheme);

themesRouter.get('/:themeId', themesController.getTheme);
themesRouter.put('/:themeId', themesController.editTheme);
themesRouter.delete('/:themeId', themesController.deleteTheme);

themesRouter.post('/:themeId/subscribe', authMiddleware(), subscriptionsController.subscribe);
themesRouter.delete('/:themeId/subscribe', authMiddleware(), subscriptionsController.unsubscribe);