import { Recipe } from '../models/index.js';

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export async function getThemes(req, res, next) {

    try {

        const recipes = await Recipe
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
            .json({ recipes, message: 'Recipes retrieved successfully' });
    
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

        const { recipeId } = req.params;

        const recipe = new Recipe
            .findById(recipeId)
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
            .json({ recipe, message: 'Recipe retrieved successfully' });

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

        const { title, content } = req.body;
        const { _id: userId } = req.user;
    
        const createdRecipe = await Recipe.create(
            { 
                title, 
                content,
                authorId: userId 
            }
        );

        if (!createdRecipe) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(201)
            .json({ 
                message: 'Created theme successfully!', 
                recipe: createdRecipe 
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

        const { title, content } = req.body;
        const { recipeId } = req.params;
        const { _id: userId } = req.user;

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { title, content },
            { new: true }
        );

        if (!updatedRecipe) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(201)
            .json({ 
                message: 'Updated theme successfully!', 
                recipe: updatedRecipe 
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
        const { recipeId } = req.params;
        const { _id: userId } = req.user;
    
        const deletedRecipe = await Recipe.findByIdAndDelete(
            recipeId, 
            { 
                title, 
                content, 
                authorId: userId 
            }, 
            { new: true }
        );

        if (!deletedRecipe) {

            return res
                .status(401)
                .json({ message: 'Not allowed!' });
        }

        res
            .status(200)
            .json({ 
                message: 'Deleted theme successfully!', 
                recipe: deletedRecipe
            });

    } catch (err) {

        next(err);
    }
}