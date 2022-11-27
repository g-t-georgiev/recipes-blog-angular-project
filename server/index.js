import express from 'express';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import dbConnector from './config/db.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// attach resolved base path to global object
// to be available across application scope
globalThis.__basedir = __dirname;

const { default: envConfig } = await import('./config/config.js');
const { default: setupExpress } = await import('./config/express.js');

dbConnector()
	.then(() => {
		
		const app = express();
		setupExpress(app);

		app.listen(envConfig.port, console.log(`Listening on port ${envConfig.port}!`));
		
	})
	.catch(console.error);