import env from './config/env.config.js';
import { expressAppInit } from './config/express.config.js';
import { dbConnector } from './config/db.config.js';

dbConnector()
	.then(function () {

		expressAppInit()
			.listen(
				env.port, 
				console.log(`Listening on port ${env.port}!`)
			);
	})
	.catch(console.error);