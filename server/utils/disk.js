import fs from 'fs';
import { auth, drive } from '@googleapis/drive';

import { hash, formatWhiteSpaces } from './helpers.js';


const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;

const authClient = new auth.GoogleAuth({
    keyFile: GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [ 'https://www.googleapis.com/auth/drive' ]
});

const service = drive({
    version: 'v3',
    auth: authClient
});

/**
 * Upload files to Google Drive
 * @param {File} file 
 * @throws
 * @returns {Promise<string>} 
 */
export async function uploadFile(file) {

    try {

        const fileMetadata = {
            name: hash( formatWhiteSpaces(file.name) ),
            parents: [ '1rVZmy68i5otVg9PgUVdDQaPFRXiFBzdx' ],
        };
        const media = {
            mimeType: file.type, 
            body: fs.createReadStream(file.path),
        };

        return await service.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        }).then(function (file) {
            console.log('File Id:', file.data.id);
            return file.data.id;
        }).catch(function (error) {
            throw error;
        });

    } catch (error) {
        // TODO: Handle error 
        console.log(error);
    }

}