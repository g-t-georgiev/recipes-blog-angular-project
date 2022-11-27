const {
    User,
    Subscription,
    Post,
    Theme,
    Like
} = await import('../models/index.js');

const { greet } = await import('../utils/index.js');

export function authenticate(req, res) {
    const { user } = req;
    res.status(user ? 200 : 401).send({ user, message: greet(user && user.username) });
}

export function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    User.findOne({ _id: userId }, { password: 0, __v: 0 }) // finding by Id and returning without password and __v
        .then(user => { res.status(200).json(user) })
        .catch(next);
}

export function editProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    const { username, email } = req.body;

    User.findOneAndUpdate({ _id: userId }, { username, email }, { runValidators: true, new: true })
        .then(x => { res.status(200).json(x) })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(409)
                    .send({ message: `This ${field} is already registered!` });
                return;
            }
            next(err);
        });
}

export function getUserThemes(req, res, next) {
    const { _id: userId } = req.user;

    Theme.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

export function getUserSubscriptions(req, res, next) {
    const { _id: userId } = req.user;

    Subscription.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

export function getUserPosts(req, res, next) {
    const { _id: userId } = req.user;

    Post.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

export function getUserLikes(req, res, next) {
    const { _id: userId } = req.user;

    Like.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}