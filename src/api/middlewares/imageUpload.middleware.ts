import { NextFunction, Request, RequestHandler, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import sharp from 'sharp';

import { SERVER } from '../../config';

function filterExtensions(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/bmp'
    ) {
        // mimetype of file matches expected type, so continue processing the request in the controller
        cb(null, true);
    } else {
        // mimetype of file did not match expected type, so skip adding the file data to the request
        cb(null, false);
    }
}

export function uploadImage(): RequestHandler {
    const options = {
        storage: multer.memoryStorage(),
        limits: { files: 1 },
        fileFilter: filterExtensions
    };

    return multer(options).single('image');
}

export async function saveImageToDisk(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (req.file) {
        const uniqueSuffix = '-' + Date.now() + '.jpg';
        const fileName = req.file.fieldname + uniqueSuffix;
        const pathToFile = path.join(SERVER.storagePath, fileName);

        await sharp(req.file.buffer).jpeg().toFile(pathToFile);
        req.file.filename = fileName;
    }

    next();
}