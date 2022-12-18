import express from 'express';
import formidable from 'express-formidable';

const { default: users } = await import('./users.js');
const { default: themes } = await import('./themes.js');
const { default: posts } = await import('./posts.js');

const { authController } = await import('../controllers/index.js');

const router = express.Router();

router.post('/register', formidable({ multiples: false }), authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.use('/users', users);
router.use('/themes', themes);
router.use('/posts', posts);

export default router;