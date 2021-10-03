import util from 'util';
import fs from 'fs';
import path from 'path';

import { ENV, LOG, SERVER } from '../../config';

const unlinkFile = util.promisify(fs.unlink);

export function getImageStoragePath(file: Express.Multer.File): string {
    if (ENV.isDevelopment()) {
        return file.filename;
    } else {
        // only two environments; so else block serves production
        return getImageStoragePathFromExternal(file);
    }
}

function getImageStoragePathFromExternal(_file: Express.Multer.File): string {
    // TODO: implement this if there is time
    return '';
}

export async function removeImage(imgFileName: string): Promise<void> {
    if (ENV.isDevelopment()) {
        const pathToImage = path.join(SERVER.storagePath, imgFileName);

        LOG.info(`Deleting image with path: ${pathToImage} since parent post is being deleted!`);
        await unlinkFile(pathToImage);
    } else {
        // only two environments; so else block serves production
        removeImageFromExternal(imgFileName);
    }
}

function removeImageFromExternal(_imgFileName: string) {
    // TODO: implement this if there is time
    return null;
}