import express from 'express';

import { authMiddleware } from '../middlewares/index.js';
import { usersController } from '../controllers/index.js';


export const router = express.Router({ mergeParams: true, strict: true });

router.get('/', authMiddleware(false), usersController.authenticate);
router.get('/email', authMiddleware(false), usersController.authenticate);
router.get('/username', authMiddleware(false), usersController.authenticate);