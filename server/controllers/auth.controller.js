import { User, TokenBlacklist } from '../models/index.js';
import { jwt, ResponseError } from '../utils/index.js';


const { 
    NODE_ENV,
    AUTH_COOKIE_NAME
} = process.env;

const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
}

export async function register(req, res, next) {
    try {

        const {
            email,
            username,
            password,
            repeatPassword
        } = req.fields;

        const { profilePicture } = req.files;

        if (password !== repeatPassword) {
            throw new ResponseError({ message: 'Passwords do not match!', status: 403 });
        }

        console.log(req.fields, req.files);

        // let createdUser = await User.create({ email, username, imageUrl, password });
        // createdUser = bsonToJson(createdUser);
        // createdUser = removePassword(createdUser);

        res
            .status(201)
            .send({
                    message: 'Account registered successfully!'
            });

    } catch (err) {

        if (err.name === 'MongoError' && err.code === 11000) {
            let field = err.message.split("index: ")[1];
            field = field.split(" dup key")[0];
            field = field.substring(0, field.lastIndexOf("_"));

            return next({ message: `This ${field} is already registered!`, status: 409 });
        }

        next(err);
    }
}


export async function login(req, res, next) {

    try {

        const {
            email,
            password
        } = req.body;

        let user = await User.findOne({ email });
        let passwordMatches = user ? user.matchPassword(password) : false;

        if (!passwordMatches) {
            throw new ResponseError({ message: 'Wrong email or password', status: 401 });
        }

        user = bsonToJson(user);
        user = removePassword(user);

        const authToken = await jwt.createToken({ id: user._id });

        const cookieOptions = { httpOnly: true };

        if (NODE_ENV === 'production') {
            cookieOptions.sameSite = 'none';
            cookieOptions.secure = true;
        }

        res.cookie(
            AUTH_COOKIE_NAME,
            authToken,
            cookieOptions
        )

        res
            .status(200)
            .json({
                user,
                message: `Welcome back, ${user.username}!`
            });

    } catch (err) {
        next(err);
    }
}


export async function logout(req, res, next) {
    try {

        const authToken = req.cookies[AUTH_COOKIE_NAME];

        await TokenBlacklist.create({ token });

        res
            .clearCookie(AUTH_COOKIE_NAME)
            .status(200)
            .json({ message: 'Logout successful!' });

    } catch (err) {

        next(err);
    }
}
