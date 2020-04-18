import { MnistReader } from './mnist-reader';
import { FileService } from 'data-science-lab-core';
import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';

describe('Data Science Lab Mnist Reader', () => {
    let reader: MnistReader;
    let fileService: FileService;

    const trainImageFile = path.join(__dirname, 'train-image.gz');
    const trainLabelFile = path.join(__dirname, 'train-labels.gz');
    const testLabelFile = path.join(__dirname, 'test-labels.gz');

    beforeAll(() => {
        const trainImageFileBuffer = Buffer.alloc(28);
        trainImageFileBuffer.writeInt32BE(3, 4); // three images of 2x2
        trainImageFileBuffer.writeInt32BE(2, 8); // rows
        trainImageFileBuffer.writeInt32BE(2, 12); // columns
        trainImageFileBuffer.writeInt8(1, 16); // first image 1,2,3,4
        trainImageFileBuffer.writeInt8(2, 17);
        trainImageFileBuffer.writeInt8(3, 18);
        trainImageFileBuffer.writeInt8(4, 19);
        trainImageFileBuffer.writeInt8(1, 20); // second image 1,2,3,4
        trainImageFileBuffer.writeInt8(2, 21);
        trainImageFileBuffer.writeInt8(3, 22);
        trainImageFileBuffer.writeInt8(4, 23);
        trainImageFileBuffer.writeInt8(1, 24); // third image 1,2,3,4
        trainImageFileBuffer.writeInt8(2, 25);
        trainImageFileBuffer.writeInt8(3, 26);
        trainImageFileBuffer.writeInt8(4, 27);
        fs.writeFileSync(trainImageFile, zlib.gzipSync(trainImageFileBuffer));

        const trainLabelsFileBuffer = Buffer.alloc(11);
        trainLabelsFileBuffer.writeInt32BE(3, 4); // three labels
        trainLabelsFileBuffer.writeInt8(1, 8); // first label 1
        trainLabelsFileBuffer.writeInt8(2, 9);
        trainLabelsFileBuffer.writeInt8(3, 10);
        fs.writeFileSync(trainLabelFile, zlib.gzipSync(trainLabelsFileBuffer));

        const testLabelsFileBuffer = Buffer.alloc(13);
        testLabelsFileBuffer.writeInt32BE(5, 4); // five labels
        testLabelsFileBuffer.writeInt8(1, 8); // first label 1
        testLabelsFileBuffer.writeInt8(2, 9);
        testLabelsFileBuffer.writeInt8(3, 10);
        testLabelsFileBuffer.writeInt8(4, 11);
        testLabelsFileBuffer.writeInt8(5, 12);
        fs.writeFileSync(testLabelFile, zlib.gzipSync(testLabelsFileBuffer));

    });


    beforeEach(() => {
        fileService = jasmine.createSpyObj('FileService', ['openFile']);
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(trainImageFile));
            });
        });

        reader = new MnistReader();
        reader.setFileService(fileService);
    });

    it('options should return one option', () => {
        const options = reader.getOptions();

        expect(options.options().length).toBe(1);
        expect(options.noMore()).toBeFalsy();
    })

    it('option should throw error for fetch', () => {
        reader.getOptions();

        expect(() => {
            reader.fetch();
        }).toThrowError();
    });

    it('command should throw error for cmd', async (done) => {
        const options = reader.getOptions();

        try {
            await options.executeCommand('command');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('command should open files', async () => {
        await reader.getOptions().executeCommand('images');
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(trainLabelFile));
            });
        });
        await reader.getOptions().executeCommand('labels');

        const data = reader.fetch();

        expect(data.features).toEqual(['image', 'label']);
        expect(data.examples).toEqual([[[1, 2, 3, 4], 1], [[1, 2, 3, 4], 2], [[1, 2, 3, 4], 3]]);
        expect(reader.getOptions().noMore()).toBeTruthy();
    });

    it('fetch after command should throw', async (done) => {
        await reader.getOptions().executeCommand('images');

        try {
            reader.fetch();
            done.fail();
        } catch (exception) {
            expect().nothing();
            done();
        }
    });

    it('fetch with different sizes should throw', async (done) => {
        await reader.getOptions().executeCommand('images');
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(testLabelFile));
            });
        });
        await reader.getOptions().executeCommand('labels');

        try {
            reader.fetch();
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('fetch image should throw for undefined buffer', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve();
            });
        });
        try {
            await reader.getOptions().executeCommand('images');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });


    it('fetch label should throw for undefined buffer', async (done) => {
        await reader.getOptions().executeCommand('images');
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve();
            });
        });
        try {
            await reader.getOptions().executeCommand('labels');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('fetch images should throw for invalid header', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(Buffer.alloc(16));
            });
        });
        try {
            await reader.getOptions().executeCommand('images');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('fetch labels should throw for invalid header', async (done) => {
        await reader.getOptions().executeCommand('images');
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(Buffer.alloc(8));
            });
        });
        try {
            await reader.getOptions().executeCommand('labels');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('fetch images should throw for incorrect amount and size', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            const buffer = Buffer.alloc(19);
            buffer.writeInt32BE(3, 4);
            buffer.writeInt32BE(2, 8);
            buffer.writeInt32BE(2, 12);
            buffer.writeInt8(1, 16);
            buffer.writeInt8(2, 17);
            buffer.writeInt8(3, 18);
            return new Promise<Buffer>((resolve) => {
                resolve(buffer);
            });
        });
        try {
            await reader.getOptions().executeCommand('images');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('fetch label should throw for incorrect amount and size', async (done) => {
        await reader.getOptions().executeCommand('images');
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            const buffer = Buffer.alloc(11);
            buffer.writeInt32BE(4, 4); // three labels
            buffer.writeInt8(1, 8); // first label 1
            buffer.writeInt8(2, 9);
            buffer.writeInt8(3, 10);
            return new Promise<Buffer>((resolve) => {
                resolve(buffer);
            });
        });
        try {
            await reader.getOptions().executeCommand('labels');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });



});
