import fs from 'fs';
import path from 'path';
import { getImageStoragePath, removeImage } from '.';
import { ENV, SERVER } from '../../config';

// TODO: figure out why this throws `fs.writeSync` is not a function when all tests are run
// but passes when tested individually
// jest.mock('fs', () => ({
//     promises: {
//         unlink: jest.fn()
//     }
// }));

ENV.isDevelopment = jest.fn().mockReturnValue(true);

test('gets image storage path from file data', () => {
    // setup
    const fileData = { filename: 'fake image path key' } as Express.Multer.File;

    // assert
    expect(getImageStoragePath(fileData)).toEqual(fileData.filename);
});

test.skip('image is removed successfully', async () => {
    // setup
    SERVER.storagePath = 'fake path to image storage location';
    const imgPathKey = 'fake image key';

    // execute
    await removeImage(imgPathKey);

    // assert
    expect(fs.promises.unlink).toBeCalledTimes(1);
    expect(fs.promises.unlink).toBeCalledWith(path.join(SERVER.storagePath, imgPathKey));
});