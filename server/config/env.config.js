import * as appConfig from '../app.config.js';

const config = {
    development: {
        port: appConfig.API_PORT,
        dbURL: appConfig.DB_URL_CREDENTIALS,
        origin: [
            'http://localhost:5555', 
            'http://localhost:4200'
        ],
    },
    production: {
        port: appConfig.API_PORT,
        dbURL: appConfig.DB_URL_CREDENTIALS,
        origin: [],
    }
};

// console.log(config);

export default config[appConfig.NODE_ENV];
