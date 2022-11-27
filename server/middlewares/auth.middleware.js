const { jwt } = await import('../utils/index.js');
const { authCookieName } = await import('../app-config.js');
const {
    userModel,
    tokenBlacklistModel
} = await import('../models/index.js');


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
        const token = req.cookies[authCookieName] ?? '';
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }

                userModel.findById(data.id)
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