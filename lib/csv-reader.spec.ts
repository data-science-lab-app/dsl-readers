import { CsvReader, CsvReaderPluginOptions } from './csv-reader';
import { FileService } from 'data-science-lab-core';
import * as path from 'path';
import * as fs from 'fs';

describe('Data Science Lab Csv Reader', () => {
    let reader: CsvReader;
    let fileService: FileService;

    const csvFile = path.join(__dirname, 'file.csv');
    const periodsvFile = path.join(__dirname, 'period.csv');
    const noHeaderFile = path.join(__dirname, 'noHeader.csv');

    beforeEach(() => {
        fs.writeFileSync(csvFile,
            `numbers, \tstring\n` +
            `1,\tone\t\r\n\n` +
            `2,\ttwo \r\n`);
        fs.writeFileSync(periodsvFile,
            `numbers . \tstring\n` +
            `1 .\tone\t\r\n\n` +
            `2 .\ttwo \r\n`);
        fs.writeFileSync(noHeaderFile,
            `1,\tone\t\r\n\n` +
            `2,\ttwo \r\n`);

        fileService = jasmine.createSpyObj('FileService', ['openFile']);
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(csvFile));
            });
        });

        reader = new CsvReader();
        reader.setFileService(fileService);
    });

    it('options should return two options', () => {
        const options = reader.getOptions();

        expect(options.options().length).toBe(2);
        expect(options.noMore()).toBeFalsy();
    });

    it('options after submit should return one option', () => {
        const options = reader.getOptions();
        options.submit({ headers: true, seperator: '' });

        expect(options.options().length).toBe(1);
        expect(options.noMore()).toBeFalsy();
    });

    it('submit twice should throw error', () => {
        const options = reader.getOptions();
        options.submit({ headers: true, seperator: '' });

        expect(() => {
            options.submit({ headers: true, seperator: '' });
        }).toThrowError();
    });

    it('command should throw error for cmd', async (done) => {
        const options = reader.getOptions();
        options.submit({ headers: true, seperator: '' });

        try {
            await options.executeCommand('command');
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('submit and command should open file with contents', async () => {
        const options = reader.getOptions();
        options.submit({ headers: true, seperator: '' });
        await options.executeCommand('browse');
        const data = reader.fetch();

        expect(data.features).toEqual(['numbers', 'string']);
        expect(data.examples).toEqual([[1, "one"], [2, "two"]]);
        expect(options.noMore()).toBeTruthy();
    });

    it('submit and command should open file with contents seperated form period.', async () => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(periodsvFile));
            });
        });
        const options = reader.getOptions();
        options.submit({ headers: true, seperator: '.' });
        await options.executeCommand('browse');
        const data = reader.fetch();

        expect(data.features).toEqual(['numbers', 'string']);
        expect(data.examples).toEqual([[1, "one"], [2, "two"]]);
        expect(options.noMore()).toBeTruthy();
    });

    it('submit and command should open file with contents and no header', async () => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(noHeaderFile));
            });
        });
        const options = reader.getOptions();
        options.submit({ headers: false, seperator: ',' });
        await options.executeCommand('browse');
        const data = reader.fetch();

        expect(data.features).toEqual(['feature 1', 'feature 2']);
        expect(data.examples).toEqual([[1, "one"], [2, "two"]]);
        expect(options.noMore()).toBeTruthy();
    });

    it('open file should throw error', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((_, reject) => {
                reject(new Error('New error'));
            });
        });
        const options = reader.getOptions();
        options.submit({ headers: false, seperator: ',' });
        try {
            await options.executeCommand('browse');
            done.fail()
        } catch (exception) {
            expect(options.noMore()).toBeFalsy();
            done();
        }
    });

});