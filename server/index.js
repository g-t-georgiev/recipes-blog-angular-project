(async function() {

	try {

		(await import('dotenv')).config();
		// console.log(process.env);

		const express = (await import('express')).default;
		const { dirname } = await import('path');
		const { fileURLToPath } = await import('url');

		const envConfig = (await import('./config/env.config.js')).default;
		const expressConfig = (await import('./config/express.config.js')).default;
		const dbConnector = (await import('./config/db.config.js')).default

		const __dirname = dirname(fileURLToPath(import.meta.url));
		globalThis.__basedir = __dirname;

		await dbConnector();

		const app = express();
		expressConfig(app);

		app.listen(envConfig.port, console.log(`Listening on port ${envConfig.port}!`));

	} catch (err) {

		console.error("index.js#annonymous", err);
	}

})();