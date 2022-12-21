import crypto from 'crypto';

/**
 * @typedef User 
 * @property {string} username 
 * @property {string} email 
 * @property {string} imageUrl 
 * @property {string | undefined} password 
 * @property {Date | string | undefined} createdAt 
 * @property {Date | string | undefined} updatedAt 
 * @property {string} _id 
 * @property {number | undefined} __v
 */

/**
 * Parse binary JSON to JSON format.
 * @param {User} data 
 * @returns {User}
 */
export function bsonToJson(data) { 
    return JSON.parse(JSON.stringify(data)) 
};

/**
 * Removes unnecessary fields from retrieved user entry from database.
 * @param {User} data 
 * @returns {Omit<User, 'password' | 'createdAt' | 'updatedAt' | '__v'>}
 */
export function removePassword(data) {
    const { password, __v, createdAt, updatedAt, ...userData } = data;
    return userData
}

/**
 * Returns a 256b hashed representation of a string value
 * @param {string} value
 * @returns {string}
 */
export function hash(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Replaces all white spaces in a string with dashes
 * @param {string} value 
 * @returns {string}
 */
export function formatWhiteSpaces(value) {
    return encodeURIComponent(value.replace(/\s/g, "-"));
}