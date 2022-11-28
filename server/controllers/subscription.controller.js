import { Subscription } from '../models/index.js';

export async function subscribe(req, res, next) {

    try {

        const { themeId } = req.params;
        const { _id: userId } = req.user;
    
        // console.log('subscribed to theme ' + themeId);
    
        const createdSubscription = await Subscription.create(
            { 
                themeId, 
                authorId: userId 
            }
        );

        res
            .status(200)
            .json({
                message: 'Subscribed successfully!', 
                data: createdSubscription
            });

    } catch (err) {

        next(err);
    }
}

export async function unsubscribe(req, res, next) {

    try {

        const { themeId } = req.params;
        const { _id: userId } = req.user;

        const deletedSubscription = await Subscription.deleteOne(
            { 
                themeId, 
                authorId: userId 
            }
        );

        res
            .status(200)
            .json({
                message: 'Unsubscribed successfully!', 
                data: deletedSubscription
            })

    } catch (err) {
        
        next(err);
    }
}