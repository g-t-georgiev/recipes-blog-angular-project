import path from 'path';

export const formidableOptions = { 
    multiples: false, // parse files as an object instead of a list
    maxFieldsSize: 100 * 1024 * 1024, // limit file size to 10MB
    uploadDir: path.resolve('public', 'files') // change default temp upload folder
};