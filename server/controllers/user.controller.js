import {
    User,
    Subscription,
    Post,
    Theme,
    Like
} from '../models/index.js';

import { ResponseError } from '../utils/index.js';


export async function authenticate(req, res, next) {
    const { user } = req;

    try {

        const message = `Welcome back, ${user?.username ?? 'guest'}!`;
    
        if (!user) {
            throw new ResponseError({ message, status: 401 });
        }
        
        res.status(200).json({ user, message });

    } catch (err) {

        next(err);
    }

}

export async function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    try {

        // finding by Id and return without password and __v
        const user = await User.findOne(
            { _id: userId }, 
            { password: 0, __v: 0 }
        );

        if (!user) {
            throw new ResponseError({ message: 'No entry matches id', status: 404 });
        }

        res.status(200).json({ user, message: 'Profile retrieved successfully' });

    } catch (err) {

        next(err);
    }
}

export async function editProfileInfo(req, res, next) {

    try {

        const { _id: userId } = req.user;
        const { username, email } = req.body;
    
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, 
            { username, email }, 
            { runValidators: true, new: true }
        );

        if (!updatedUser) {
            throw new ResponseError({ message: 'No entry matches id', status: 404 });
        }
        
        res.status(200).json({ user: updatedUser, message: 'Profile editted successfully' });
        
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