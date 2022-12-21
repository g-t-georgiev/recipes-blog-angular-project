import { User, TokenBlacklist } from '../models/index.js';
import { jwt } from '../utils/index.js';



const { 
    NODE_ENV,
    AUTH_COOKIE_NAME
} = process.env;

/**
 * Authentication middleware for filtering request with invalid tokens
 * @param {Boolean} redirectUnauthenticated 
 * @returns {(req: Request, res: Response, next: Function) => void}
 */
export function authMiddleware(redirectUnauthenticated = true) {

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     * @returns {void}
     */
    return function (req, res, next) {

        const token = req.cookies[AUTH_COOKIE_NAME ?? 'auth-cookie'] ?? '';

        Promise.all([
            jwt.verifyToken(token),
            TokenBlacklist.findOne({ token })
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }

                User.findById(data.id)
                    .then(user => {
                        req.user = user;
                        req.isLogged = true;
                        next();
                    })
            })
            .catch(err => {
                if (!redirectUnauthenticated) {
                    next();
                    return;
                }

                if ([
                        'token expired', 
                        'blacklisted token', 
                        'jwt must be provided'
                    ].includes(err.message)) {

                    return next({ message: "Invalid token!", status: 401 });
                }

                next(err);
            });
    }
}