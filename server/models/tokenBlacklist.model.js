import mongoose from 'mongoose';

import * as appConfig from '../app.config.js';

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
    { expireAfterSeconds: documentExpireTimeOptions[appConfig.NODE_ENV] }
);

export const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);