import { Post } from '../models/index.js';

export async function getLatestsPosts(req, res, next) {

    try {

        const limit = Number(req.query.limit) || 0;
        const posts = await Post
            .find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate([
                {
                    path: 'authorId',
                    select: {
                        username: 1
                    }
                }
            ]);

        res
            .status(200)
            .json({ data: posts });

    } catch (err) {

        next(err);
    }
}

export async function createPost(req, res, next) {

    try {

        const { _id: userId } = req.user;
        const { text, themeId } = req.body;

        const createdPost = await Post.create(
            {
                text,
                authorId: userId,
                themeId
            }
        );

        if (!createdPost) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(201)
            .json({
                message: 'Post created successfully!',
                data: createdPost
            });

    } catch (err) {

        next(err);
    }
}


export async function editPost(req, res, next) {

    try {

        const { postId } = req.params;
        const { text } = req.body;
        const { _id: userId } = req.user;

        // if provided 'userId' and post 'authorId'
        // do not match, post won't be updated

        const updatedPost = await Post.findOneAndUpdate(
            {
                _id: postId,
                authorId: userId
            },
            { text },
            { new: true }
        );

        if (!updatedPost) {

            return res
                .status(401)
                .json({ message: `Not allowed!` });
        }

        res
            .status(201)
            .json({
                message: 'Post updated successfully!',
                data: updatedPost
            });

    } catch (err) {

        next(err);
    }
}

export async function deletePost(req, res, next) {

    try {

        const { postId } = req.params;
        const { _id: userId } = req.user;

        // if provided 'userId' and post 'authorId'
        // do not match, post won't be deleted

        const deletedPost = await Post.findOneAndDelete(
            {
                _if: postId,
                authorId: userId
            }
        );

        if (!deletedPost) {

            return res
                .status(401)
                .json({ message: `Not allowed!` });
        }

        res.status(200).json({
            message: 'Post deleted successfully!',
            data: deletedPost
        });

    } catch (err) {

        next(err);
    }
}