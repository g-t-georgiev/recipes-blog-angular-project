import {
    User,
    Subscription,
    Post,
    Theme,
    Like
} from '../models/index.js';

import { ResponseError, helpers, disk } from '../utils/index.js';


const { bsonToJson, removePassword } = helpers;

export async function duplicateCrendetialsCheck(req, res, next) {
    const { user } = req;
    const { credentials } = req.query;

    try {

        if (user && (user.username === credentials || user.email === credentials)) {
            res.status(200).json(false);
            return;
        }

        // console.log(credentials);
        let duplicateUser = await User.exists({ email: credentials }) || await User.exists({ username: credentials });

        // duplicateUser = duplicateUser && bsonToJson(duplicateUser);
        // duplicateUser = duplicateUser && removePassword(duplicateUser);
        // console.log(duplicateUser);

        res.status(200).json(duplicateUser ? true : false);

    } catch (err) {

        next(err);
    }

}

export async function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    try {

        let user = await User.findOne(
            { _id: userId },
            { password: 0, __v: 0 }
        ); // querying and filtering of user document

        if (!user) {
            throw new ResponseError({ message: 'No entry matches id', status: 404 });
        }

        user = bsonToJson(user);
        user = removePassword(user); // additional filtering of retrieved user document properties

        res.status(200).json({ user, message: 'Profile retrieved successfully' });

    } catch (err) {

        next(err);
    }
}

export async function editProfileInfo(req, res, next) {

    try {

        const { _id: userId } = req.user;
        const { username, email } = req.fields;
        const { profilePicture } = req.files;

        console.log(profilePicture);

        if (await User.exists({ username }) && req.user.username !== username) {
            throw new ResponseError({ message: 'This username is already taken', status: 403 });
        }

        if (await User.exists({ email }) && req.user.email !== email) {
            throw new ResponseError({ message: 'This email is already taken', status: 403 });
        }

        let imageUrl;

        if (profilePicture) {
            // console.log(profilePicture);
            const uploadId = await disk.uploadFile(profilePicture);
            imageUrl = `https://drive.google.com/uc?id=${uploadId}`;
        }


        const filter = { _id: userId };
        const update = { username, email, ...(imageUrl ? { imageUrl } : {}) };
        const options = { runValidators: true, new: true };

        let updatedUser = await User.findOneAndUpdate(filter, update, options);

        if (!updatedUser) {
            throw new ResponseError({ message: 'No entry matches id', status: 404 });
        }

        updatedUser = bsonToJson(updatedUser);
        updatedUser = removePassword(updatedUser);

        res.status(200).json({ user: updatedUser, message: 'Profile editted successfully' });

    } catch (err) {

        next(err);
    }
}

export async function getUserThemes(req, res, next) {

    try {

        const { _id: userId } = req.user;

        const themes = await Theme.find({ authorId: userId });

        if (!themes) {
            throw new ResponseError({ message: 'No entries match id', status: 404 });
        }

        res.status(200).json({ data: themes });

    } catch (err) {

        next(err);
    }
}

export async function getUserSubscriptions(req, res, next) {

    try {

        const { _id: userId } = req.user;

        const subscriptions = await Subscription.find({ authorId: userId });

        if (!subscriptions) {
            throw new ResponseError({ message: 'No entries match id', status: 404 });
        }

        res.status(200).json({ data: subscriptions });

    } catch (err) {

        next(err);
    }
}

export async function getUserPosts(req, res, next) {

    try {

        const { _id: userId } = req.user;

        const posts = await Post.find({ authorId: userId });

        if (!posts) {
            throw new ResponseError({ message: 'No entries match id', status: 404 });
        }

        res.status(200).json({ data: posts });

    } catch (err) {

        next(err);
    }
}

export async function getUserLikes(req, res, next) {

    try {

        const { _id: userId } = req.user;

        const likes = await Like.find({ authorId: userId });

        if (!likes) {
            throw new ResponseError({ message: 'No entries match id', status: 404 });
        }

        res.status(200).json({ data: likes });

    } catch (err) {

        next(err);
    }
}