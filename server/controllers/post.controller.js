const { Post } = await import('../models/index.js');

export function getLatestsPosts(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    Post.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate([
            {
                path: 'authorId',
                select: {
                    username: 1
                }
            }
        ])
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(next);
}

export function createPost(req, res, next) {
    const { _id: userId } = req.user;
    const { text, themeId } = req.body;

    Post.create({ text, authorId: userId, themeId })
        .then(createdPost => {
            if (createdPost) {
                res.status(201).json({ message: 'Post created successfully!', data: createdPost });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}


export function editPost(req, res, next) {
    const { postId } = req.params;
    const { text } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be updated
    Post.findOneAndUpdate({ _id: postId, authorId: userId }, { text }, { new: true })
        .then(updatedPost => {
            if (updatedPost) {
                res.status(201).json({ message: 'Post updated successfully!', data: updatedPost });
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

export function deletePost(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be deleted
    Post.findOneAndDelete({ _id: postId, authorId: userId })
        .then(deletedPost => {
            if (deletedPost) {
                res.status(200).json({ message: 'Post deleted successfully!', data: deletedPost });
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}