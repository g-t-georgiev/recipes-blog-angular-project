import { Post } from '../models/index.js';

export async function like(req, res, next) {

    try {

        const { postId } = req.params;
        const { _id: userId } = req.user;

        // console.log('like');

        const createdLike = await Post.create(
            {
                postId,
                authorId: userId
            }
        );

        res
            .status(200)
            .json({
                message: 'Liked successfully!',
                data: createdLike
            });

    } catch (err) {

        next(err);
    }
}

export async function unlike(req, res, next) {

    try {

        const { postId } = req.params;
        const { _id: userId } = req.user;

        // console.log('unlike');

        const deletedLike = await Post.deleteOne({
            postId,
            authorId: userId
        });

        res
            .status(200)
            .json({
                message: 'Unliked successfully!',
                data: deletedLike
            });

    } catch (err) {

        next(err);
    }
}