const { Post } = await import('../models/index.js');

 export function like(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    // console.log('like');

    Post.create({ postId, authorId: userId })
        .then((x) => { res.status(200).json({ message: 'Liked successfully!', data: x }) })
        .catch(next);
}

export function unlike(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    // console.log('unlike');

    Post.deleteOne({ postId, authorId: userId })
        .then((x) => res.status(200).json({ message: 'Unliked successfully!', data: x }))
        .catch(next);
}