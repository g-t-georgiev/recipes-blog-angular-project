import path, { dirname } from 'path';
import url, { fileURLToPath } from 'url';

import env from './config/env.config.js';
import { expressAppInit } from './config/express.config.js';
import { dbConnector } from './config/db.config.js';


const __dirname = dirname(fileURLToPath(import.meta.url));
globalThis.__basedir = __dirname;

dbConnector()
	.then(function () {

		expressAppInit()
			.listen(
				env.port, 
				console.log(`Listening on port ${env.port}!`)
			);
	})
	.catch(console.error);