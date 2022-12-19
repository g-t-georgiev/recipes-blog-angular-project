import jwt from 'jsonwebtoken';


const { 
    NODE_ENV,
    JWT_EXPIRES_IN, 
    JWT_SECRET 
} = process.env;

const defaultOptions = {
    expiresIn: JWT_EXPIRES_IN ?? '1d',
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
            JWT_SECRET ?? 'my-jwt-secret-key', 
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
            JWT_SECRET ?? 'my-jwt-secret-key', 
            {},
            cb(resolve, reject)
        );
    });
}