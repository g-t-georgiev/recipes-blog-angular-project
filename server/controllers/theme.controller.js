import { Theme } from '../models/index.js';

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export async function getThemes(req, res, next) {

    try {

        const themes = await Theme
            .find({})
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
            .json({ data: themes });
    
    } catch (err) {

        next(err);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export async function getTheme(req, res, next) {

    try {

        const { themeId } = req.params;

        const theme = new Theme
            .findById(themeId)
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
            ]);

        res
            .status(200)
            .json({ data: theme });

    } catch (err) {

        next(err);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

 export async function createTheme(req, res, next) {

    try {

        const { title } = req.body;
        const { _id: userId } = req.user;
    
        const createdTheme = await Theme.create(
            { 
                title, 
                authorId: userId 
            }
        );

        if (!createdTheme) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(201)
            .json({ 
                message: 'Created theme successfully!', 
                data: createdTheme 
            });


    } catch (err) {

        next(err);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export async function editTheme(req, res, next) {

    try {

        const { title } = req.body;
        const { themeId } = req.params;
        const { _id: userId } = req.user;

        const updatedTheme = await Theme.findByIdAndUpdate(
            themeId,
            { title },
            { new: true }
        );

        if (!updatedTheme) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(201)
            .json({ 
                message: 'Updated theme successfully!', 
                data: updatedTheme 
            });

    } catch (err) {

        next(err);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export async function deleteTheme(req, res, next) {

    try {

        const { title } = req.body;
        const { themeId } = req.params;
        const { _id: userId } = req.user;
    
        const deletedTheme = await Theme.findByIdAndDelete(
            themeId, 
            { title }, 
            { new: true }
        );

        if (!deletedTheme) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(200)
            .json({ 
                message: 'Deleted theme successfully!', 
                data: deletedTheme 
            });

    } catch (err) {

        next(err);
    }
}