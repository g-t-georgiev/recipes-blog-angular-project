import path from 'path';

export const formidableOptions = { 
    multiples: false, // parse files as an object instead of a list
    maxFieldsSize: 5 * 1024 * 1024, // limit file size to 5MB
    uploadDir: path.resolve('public', 'files') // change default temp upload folder
};