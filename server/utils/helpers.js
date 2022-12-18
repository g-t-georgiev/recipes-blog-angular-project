import crypto from 'crypto';

/**
 * Parse binary JSON to JSON format.
 * @param {BSON} data 
 * @returns {JSON}
 */
export const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };

/**
 * Removes unnecessary fields from retrieved user entry from database.
 * @param {{ username: string, email: string, imageUrl: string, password: string, createdAt: Date, updatedAt: Date, _id: string, __v: number}} data 
 * @returns {}
 */
export const removePassword = (data) => {
    const { password, __v, ...userData } = data;
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