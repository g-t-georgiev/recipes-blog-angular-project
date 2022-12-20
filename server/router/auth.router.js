import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { usersController } from '../controllers/index.js';

export const authRouter = express.Router({ mergeParams: true, strict: true });

authRouter.get('/', authMiddleware(false), usersController.authenticate);
authRouter.get('/email', authMiddleware(false), usersController.authenticate);
authRouter.get('/username', authMiddleware(false), usersController.authenticate);