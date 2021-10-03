import { ENV } from "../../config";

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