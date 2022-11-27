const { Subscription } = await import('../models/index.js');

export function subscribe(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // console.log('subscribed to theme ' + themeId);

    Subscription.create({ themeId, authorId: userId })
        .then(x => { res.status(200).json({ message: 'Subscribed successfully!', data: x }) })
        .catch(next);
}

export function unsubscribe(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // console.log('unsubscribed to theme ' + themeId);

    Subscription.deleteOne({ themeId, authorId: userId })
        .then(x => { res.status(200).json({ message: 'Unsubscribed successfully!', data: x }) })
        .catch(next);
}