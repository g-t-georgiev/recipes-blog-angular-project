import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "User"
    }
},  { 
        timestamps: true, 
        toJSON: {
            virtuals: true
        }, 
        toObject: {
            virtuals: true
        } 
    }
);

// recipeSchema.virtual('posts', {
//     ref: 'Post',
//     localField: '_id',
//     foreignField: 'themeId'
// });

// recipeSchema.virtual('subscribers', {
//     ref: 'Subscription',
//     localField: '_id',
//     foreignField: 'themeId',
//     count: true
// });

// Populate 'posts' after theme update query
// recipeSchema.post('save', function (doc, next) {
//     doc
//         .populate({
//             path: 'posts',
//             populate: {
//                 path: 'authorId',
//                 select: {
//                     username: 1,
//                 }
//             }
//         })
//         .then(
//             function () {
//                 next();
//             }
//         )
// });

export const Recipe = model('Recipe', recipeSchema);