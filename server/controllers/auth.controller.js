import { User, TokenBlacklist } from '../models/index.js';
import { jwt, ResponseError, disk, helpers } from '../utils/index.js';


const { 
    NODE_ENV,
    AUTH_COOKIE_NAME
} = process.env;


const { bsonToJson, removePassword } = helpers;

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

        // console.log(req.fields, req.files);

        let imageUrl;

        if (profilePicture) {

            // console.log(profilePicture);
            const uploadId = await disk.uploadFile(profilePicture);
            imageUrl = `https://drive.google.com/uc?id=${uploadId}`;
            
        } else {
            imageUrl = 'https://drive.google.com/uc?id=1iUrhiwfp4XxCp0xLXDUB1rL8DXVltF2n';
        }

        let matchedUserByEmail;
        let matchedUserByUsername;

        if (matchedUserByEmail = await User.findOne({ email })) {
            throw new ResponseError({ message: 'Email is already taken', status: 409 });
        }

        if (matchedUserByUsername = await User.findOne({ username })) {
            throw new ResponseError({ message: 'Username is already taken', status: 409 });
        }

        const createdUser = new User({ email, username, imageUrl, password });
        await createdUser.save();

        res.status(201)
            .json({ message: 'Account registered successfully!' });

    } catch (error) {
        next(error);
    }
}


export async function login(req, res, next) {

    try {

        const {
            username,
            password
        } = req.body;

        let user = await User.findOne({ username });
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
            AUTH_COOKIE_NAME ?? 'auth-cookie',
            authToken,
            cookieOptions
        )

        res.status(200)
            .json({ user, message: `Login successful!` });

    } catch (error) {
        next(error);
    }
}


export async function logout(req, res, next) {

    try {

        const authToken = req.cookies[AUTH_COOKIE_NAME];

        await TokenBlacklist.create({ token: authToken });

        res
            .clearCookie(AUTH_COOKIE_NAME)
            .status(200)
            .json({ message: 'Logout successful!' });

    } catch (err) {

        next(err);
    }
}
