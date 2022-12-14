import mongoose from 'mongoose';

const { 
    NODE_ENV
} = process.env;

// if (NODE_ENV === 'development') {

//     console.log(
//         'TokenBlackListModel#module',
//         'NODE_ENV: ', NODE_ENV
//     );

// }

const documentExpireTimeOptions = {
    production: 30 * 24 * 3600, // 30 days
    development: 60 // 1 minute
};


const { Schema, model } = mongoose;

const tokenBlacklistSchema = new Schema({
    token: String,
}, { timestamps: true });

tokenBlacklistSchema.index(
    { createdAt: 1 }, 
    { expireAfterSeconds: documentExpireTimeOptions[NODE_ENV] }
);

export const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);