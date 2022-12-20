import express from 'express';
import formidable from 'express-formidable';

import { formidableOptions } from '../config/formidable.config.js';

import users from './users.router.js';
import themes from './themes.router.js';
import posts from './posts.router.js';

const { authController } = await import('../controllers/index.js');

const router = express.Router();

router.post('/register', formidable(formidableOptions), authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.use('/users', users);
router.use('/themes', themes);
router.use('/posts', posts);

export default router;