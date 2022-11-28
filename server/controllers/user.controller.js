import {
    User,
    Subscription,
    Post,
    Theme,
    Like
} from '../models/index.js';

import { greet } from '../utils/index.js';

export function authenticate(req, res) {
    const { user } = req;
    res
        .status(
            user 
                ? 200 
                : 401
        )
        .json({ 
            user, 
            message: greet(user && user.username) 
        });
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
            
            return res
                .status(404)
                .json({
                    message: 'No entry matches id'
                });
        }

        res
            .status(200)
            .json({ data: user });

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

            return res
                .status(404)
                .json({
                    message: 'No entry matches id'
                });
        }
        
        res
            .status(200)
            .json({ data: updatedUser });
        
    } catch (err) {
        
        if (err.name === 'MongoError' && err.code === 11000) {
            let field = err.message.split("index: ")[1];
            field = field.split(" dup key")[0];
            field = field.substring(0, field.lastIndexOf("_"));

            res.status(409)
                .send({ message: `This ${field} is already registered!` });
            return;
        }
        
        next(err);
    }
}

export async function getUserThemes(req, res, next) {
    
    try {

        const { _id: userId } = req.user;

        const themes = await Theme.find({ authorId: userId });

        if (!themes) {

            return res
                .status(404)
                .json({
                    message: 'No entries match id'
                });
        }

        res
            .status(200)
            .json({ data: themes });

    } catch (err) {

        next(err);
    }
}

export async function getUserSubscriptions(req, res, next) {

    try {

        const { _id: userId } = req.user;

        const subscriptions = await Subscription.find({ authorId: userId });

        if (!subscriptions) {

            return res
                .status(404)
                .json({
                    message: 'No entries match id'
                });
        }

        res
            .status(200)
            .json({ data: subscriptions });

    } catch (err) {

        next(err);
    }
}

export async function getUserPosts(req, res, next) {

        try {

        const { _id: userId } = req.user;

        const posts = await Post.find({ authorId: userId });

        if (!posts) {

            return res
                .status(404)
                .json({
                    message: 'No entries match id'
                });
        }

        res
            .status(200)
            .json({ data: posts });

    } catch (err) {

        next(err);
    }
}

export async function getUserLikes(req, res, next) {

    try {

        const { _id: userId } = req.user;

        const likes = await Like.find({ authorId: userId });

        if (!likes) {

            return res
                .status(404)
                .json({
                    message: 'No entries match id'
                });
        }

        res
            .status(200)
            .json({ data: likes });

    } catch (err) {

        next(err);
    }
}