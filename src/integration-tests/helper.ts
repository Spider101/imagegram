import fs from 'fs';
import path from 'path';

export function deleteFilesInDirectory(pathToDir: string): void {
    const files = fs.readdirSync(pathToDir);
    if (files.length > 0) {
        for (const file of files) {
            const filePath = path.join(pathToDir, file);
            if (fs.statSync(filePath).isFile()) {
                console.info(`Deleting file from path: ${filePath} ...`)
                fs.unlinkSync(filePath);
            }
        }
    }
}
