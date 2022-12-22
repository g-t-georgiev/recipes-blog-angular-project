import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { recipesController, subscriptionsController } from '../controllers/index.js';

export const recipesRouter = express.Router();

recipesRouter.get('/', recipesController.getThemes);
recipesRouter.post('/', authMiddleware(), recipesController.createTheme);

recipesRouter.get('/:recipeId', recipesController.getTheme);
recipesRouter.put('/:recipeId', recipesController.editTheme);
recipesRouter.delete('/:recipeId', recipesController.deleteTheme);

recipesRouter.post('/:recipeId/subscribe', authMiddleware(), subscriptionsController.subscribe);
recipesRouter.delete('/:recipeId/subscribe', authMiddleware(), subscriptionsController.unsubscribe);