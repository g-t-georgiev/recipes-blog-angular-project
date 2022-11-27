const jwt = await import('jsonwebtoken');

const secret = process.env.SECRET || 'SoftSecret';

/**
 * Wrapper for the native create token method of jwt library
 * @param {{ [key: String]: any }} data 
 * @param {{ [key: String]: String | Number }} options
 * @returns {Promise<string>}
 */
export function createToken(payload, options = { expiresIn: '1d' }) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(token);
        });
    });
}


/**
 * Wrapper for the native verify token method of jwt library
 * @param {String} token 
 * @returns {Promise<any>}
 */
export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}