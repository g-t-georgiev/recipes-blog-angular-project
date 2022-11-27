const mongoose = await import('mongoose');

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const themeSchema = new Schema({
    title: {
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

themeSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'themeId'
});

themeSchema.virtual('subscribers', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'themeId',
    count: true
});

// Populate 'posts' after theme update query
themeSchema.post('save', function (doc, next) {
    doc
        .populate({
            path: 'posts',
            populate: {
                path: 'authorId',
                select: {
                    username: 1,
                }
            }
        })
        .then(
            function () {
                next();
            }
        )
});

export const Theme = model('Theme', themeSchema);