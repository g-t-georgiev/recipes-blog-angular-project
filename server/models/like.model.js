const mongoose = await import('mongoose');

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const likeSchema = new Schema({
    authorId: {
        type: ObjectId,
        ref: 'User'
    },
    postId: {
        type: ObjectId,
        ref: 'Post'
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

export const Like = model('Like', likeSchema);