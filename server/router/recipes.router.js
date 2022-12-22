import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { recipesController, subscriptionsController } from '../controllers/index.js';

export const recipesRouter = express.Router();

recipesRouter.get('/', recipesController.getAll);
recipesRouter.post('/', authMiddleware(), recipesController.create);

recipesRouter.get('/:recipeId', recipesController.get);
recipesRouter.put('/:recipeId', recipesController.edit);
recipesRouter.delete('/:recipeId', recipesController.remove);

recipesRouter.post('/:recipeId/subscribe', authMiddleware(), subscriptionsController.subscribe);
recipesRouter.delete('/:recipeId/subscribe', authMiddleware(), subscriptionsController.unsubscribe);