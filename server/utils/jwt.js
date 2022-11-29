import jwt from 'jsonwebtoken';

const { 
    NODE_ENV,
    JWT_EXPIRES_IN, 
    JWT_SECRET 
} = process.env;

// if (NODE_ENV === 'development') {

//     console.log(
//         'jwt#module',
//         'NODE_ENV: ', NODE_ENV,
//         'JWT_EXPIRES_IN: ', JWT_EXPIRES_IN,
//         'JWT_SECRET: ', JWT_SECRET
//     );

// }

const defaultOptions = {
    expiresIn: JWT_EXPIRES_IN,
};

const cb = function(resolve, reject) {
    return function(err, data) {

        if (err) {
            reject(err);
            return;
        }
    
        resolve(data);

    }
} 

/**
 * Wrapper for the native create token method of jwt library
 * @param {{ [key: String]: any }} payload 
 * @param {{ [key: String]: String | Number }} options
 * @returns {Promise<string>}
 */
export function createToken(payload, options = defaultOptions) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            JWT_SECRET, 
            options, 
            cb(resolve, reject)
        );
    });
}


/**
 * Wrapper for the native verify token method of jwt library
 * @param {String} token 
 * @returns {Promise<any>}
 */
export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token, 
            JWT_SECRET, 
            {},
            cb(resolve, reject)
        );
    });
}