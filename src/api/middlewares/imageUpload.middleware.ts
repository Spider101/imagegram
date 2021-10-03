import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { SERVER } from '../../config';

const diskStorage = multer.diskStorage({
    destination: function(_req: Request, _file: Express.Multer.File, cb) {
        cb(null, SERVER.storagePath);
    },
    filename: function(_req: Request, file: Express.Multer.File, cb) {
        const uniqueSuffix = '-' + Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + uniqueSuffix);
    }
});

function filterExtensions(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/bmp'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export function uploadImage() {
    const options = {
        storage: diskStorage,
        limits: { files: 1 },
        fileFilter: filterExtensions
    };

    return multer(options).single('image');
}