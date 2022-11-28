import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import envConfig from './env.config.js';
import * as appConfig from '../app.config.js';

import { errorMiddleware } from '../middlewares/index.js';
import apiRouter from '../router/index.js';


const corsOptions = {
    origin: envConfig.origin,
    credentials: true
}

export default function(app) {

    app.use(express.json());

    app.use(cookieParser(appConfig.AUTH_COOKIE_SECRET));

    app.use(express.static(path.resolve(__basedir, 'static')));

    app.use(cors(corsOptions));
  
    app.use('/api', apiRouter);
  
    app.use(errorMiddleware);

};
