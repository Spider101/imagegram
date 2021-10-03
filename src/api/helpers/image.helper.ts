import util from 'util';
import fs from 'fs';
import path from 'path';

import { ENV, LOG, SERVER } from "../../config";

const unlinkFile = util.promisify(fs.unlink);

export function getImageStoragePath(file: Express.Multer.File) {
    if (ENV.isDevelopment()) {
        return file.filename;
    } else if (ENV.isProduction()) {
        getImageStoragePathFromExternal(file);
    }
}

function getImageStoragePathFromExternal(_file: Express.Multer.File) {
    // TODO: implement this if there is time
    return '';
}

export async function removeImage(imgFileName: string) {
    if (ENV.isDevelopment()) {
        const pathToImage = path.join(SERVER.storagePath, imgFileName);

        LOG.info(`Deleting image with path: ${pathToImage} since parent post is being deleted!`);
        await unlinkFile(pathToImage);
    } else if (ENV.isProduction()) {
        removeImageFromExternal(imgFileName);
    }
}

function removeImageFromExternal(_imgFileName: string) {
    // TODO: implement this if there is time
    return null;
}