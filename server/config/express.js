const express = await import('express');
const path = await import('path');
const { default: cookieParser } = await import('cookie-parser');
const { default: cors } = await import('cors');

const cookieSecret = process.env.COOKIESECRET || 'RecipeBlogApp00';
const { errorMiddleware } = await import('../middlewares/index.js');
const { default: envConfig } = await import('./config.js');
const { default: apiRouter } = await import('../router/index.js');

export default function(app) {

    app.use(express.json());

    app.use(cookieParser(cookieSecret));

    app.use(express.static(path.resolve(__basedir, 'static')));

    app.use(cors({
        origin: envConfig.origin,
        credentials: true
    }));
  
    app.use('/api', apiRouter);
  
    app.use(errorMiddleware);

};
