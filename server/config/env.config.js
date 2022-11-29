const { 
    NODE_ENV,
    API_PORT,
    DB_URL_CREDENTIALS
} = process.env;

// if (NODE_ENV === 'development') {

//     console.log(
//         'EnvConfig#module',
//         'NODE_ENV: ', NODE_ENV,
//         'API_PORT: ', API_PORT,
//         'DB_URL_CREDENTIALS: ', DB_URL_CREDENTIALS
//     );

// }

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
