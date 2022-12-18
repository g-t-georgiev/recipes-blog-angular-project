import express from 'express';
import path from 'path';
import formidable from 'express-formidable';

const { default: users } = await import('./users.js');
const { default: themes } = await import('./themes.js');
const { default: posts } = await import('./posts.js');

const { authController } = await import('../controllers/index.js');

const formidableOptions = { 
    multiples: false, // parse files as an object instead of a list
    maxFieldsSize: 100 * 1024 * 1024, // limit file size to 10MB
    uploadDir: path.resolve('public', 'files') // change default temp upload folder
};

const router = express.Router();

router.post('/register', formidable(formidableOptions), authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.use('/users', users);
router.use('/themes', themes);
router.use('/posts', posts);

export default router;