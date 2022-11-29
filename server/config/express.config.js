import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import envConfig from './env.config.js';

import { errorMiddleware } from '../middlewares/index.js';
import router from '../router/index.js';


const { 
    NODE_ENV,
    AUTH_COOKIE_SECRET
} = process.env;

// if (NODE_ENV === 'development') {

//     console.log(
//         'ExpressConfig#module',
//         'NODE_ENV: ', NODE_ENV,
//         'AUTH_COOKIE_SECRET: ', AUTH_COOKIE_SECRET
//     );

// }

const corsOptions = {
    origin: envConfig.origin,
    credentials: true
}

/**
 * Initialize express application with configuration options.
 */
export function expressAppInit() {

    const app = express(); // init app
    app.use( express.json() ); // parse json
    app.use( cookieParser( AUTH_COOKIE_SECRET ) ); // parse cookies
    app.use( express.static( path.resolve( __basedir, 'static' ) ) ); // serve static files from 'static' directory
    app.use( cors( corsOptions ) ); // pars cross-origin requests
    app.use( '/api', router ); // setup router
    app.use( errorMiddleware ); // parse errors
    
    return app;

};


export default expressAppInit;