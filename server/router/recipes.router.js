import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { recipesController, subscriptionsController } from '../controllers/index.js';

export const recipesRouter = express.Router();

recipesRouter.get('/', recipesController.getThemes);
recipesRouter.post('/', authMiddleware(), recipesController.createTheme);

recipesRouter.get('/:themeId', recipesController.getTheme);
recipesRouter.put('/:themeId', recipesController.editTheme);
recipesRouter.delete('/:themeId', recipesController.deleteTheme);

recipesRouter.post('/:themeId/subscribe', authMiddleware(), subscriptionsController.subscribe);
recipesRouter.delete('/:themeId/subscribe', authMiddleware(), subscriptionsController.unsubscribe);