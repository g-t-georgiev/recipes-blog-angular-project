const { Theme, Post } = await import('../models/index.js');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export function getThemes(req, res, next) {
    Theme.find({})
        .populate([
            {
                path: 'authorId',
                select: {
                    username: 1
                }
            }
        ])
        .then(themes => res.json(themes))
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export function getTheme(req, res, next) {
    const { themeId } = req.params;

    Theme.findById(themeId)
        .populate([
            {
                path: 'posts',
                select: {
                    __v: 0
                },
                populate: {
                path: 'authorId',
                select: {
                    username: 1,
                }
                }
            },
            {
                path: 'subscribers'
            }
        ])
        .then(theme => res.json(theme))
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

 export function createTheme(req, res, next) {
    const { title } = req.body;
    const { _id: userId } = req.user;

    Theme.create({ title, authorId: userId })
        .then(createdTheme => {
            if (createdTheme) {
                res.status(201).json({ message: 'Created theme successfully!', data: createdTheme });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export function editTheme(req, res, next) {
    const { title } = req.body;
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be deleted

    // Post.findOneAndDelete({ _id: postId, authorId: userId });
    
    Theme.findByIdAndUpdate(themeId, { title }, { new: true })
        .then(updatedTheme => {
            if (updatedTheme) {
                res.status(201).json({ message: 'Updated theme successfully!', data: updatedTheme });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export function deleteTheme(req, res, next) {
    const { title } = req.body;
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be deleted

    // Post.findOneAndDelete({ _id: postId, authorId: userId });

    themeModel.findByIdAndDelete(themeId, { title }, { new: true })
        .then(deletedTheme => {
            if (deletedTheme) {
                res.status(201).json({ message: 'Deleted theme successfully!', data: deletedTheme });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}