import express from 'express';
import formidable from 'express-formidable';

import { formidableOptions } from '../config/formidable.config.js';

import { usersRouter } from './users.router.js';
import { themesRouter } from './themes.router.js';
import { postsRouter } from './posts.router.js';

const { authController } = await import('../controllers/index.js');

const router = express.Router();

router.post('/register', formidable(formidableOptions), authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.use('/users', usersRouter);
router.use('/themes', themesRouter);
router.use('/posts', postsRouter);

export default router;