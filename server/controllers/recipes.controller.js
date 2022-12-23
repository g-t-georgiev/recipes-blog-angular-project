import { Recipe } from '../models/index.js';

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

export async function getAll(req, res, next) {

    let { page, size, title } = req.query;

    try {

        if (!page || isNaN(page) ||  page < 1) {
            page = 1;
        }

        if (!size || isNaN(size) || size < 1) {
            size = 10;
        }

        // console.log(page, size, title);

        const queryFilter = {};

        if (title && typeof title === 'string') {
            queryFilter.title = { $regex: title, $options: 'i' };
        }

        // console.log(queryFilter);

        const queryProjection = {
            content: 0, 
            updatedAt: 0, 
            __v: 0,
        }

        const queryOptions = {
            limit: Number(size),
            skip: size * (page - 1),
            populate: 'authorId'
        }

        // console.log(queryOptions);

        let [ recipes, total ] = await Promise.all([
            Recipe.find(queryFilter, queryProjection, queryOptions).exec(),
            Recipe.countDocuments(queryFilter).exec()
        ]);

        recipes = recipes ?? [];
        // console.log(recipes);
        // console.log(total);

        res.status(200)
            .json({ recipes, message: 'Recipes retrieved successfully', total });
    
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

export async function get(req, res, next) {

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

 export async function create(req, res, next) {

    try {

        const { title, content } = req.body;
        const { _id: userId } = req.user;
    
        const createdRecipe = userId && await Recipe.create(
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

export async function edit(req, res, next) {

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

export async function remove(req, res, next) {

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