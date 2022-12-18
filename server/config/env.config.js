const { 
    NODE_ENV,
    API_PORT,
    DB_URL_CREDENTIALS
} = process.env;

const config = {
    development: {
        port: API_PORT,
        dbURL: DB_URL_CREDENTIALS,
        origin: [
            'http://localhost:5555', 
            'http://localhost:4200'
        ],
    },
    production: {
        port: API_PORT,
        dbURL: DB_URL_CREDENTIALS,
        origin: [],
    }
};

// console.log(config);

export default config[NODE_ENV];
