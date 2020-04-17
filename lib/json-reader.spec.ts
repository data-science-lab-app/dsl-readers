import { JsonReader } from './json-reader';
import { FileService, Option } from 'data-science-lab-core';
import * as path from 'path';
import * as fs from 'fs';

describe('Data Science Lab Json Reader', () => {
    let reader: JsonReader;
    let fileService: FileService;

    const jsonFile = path.join(__dirname, 'file.json');
    const invalidFile = path.join(__dirname, 'invalid.json');
    const emptyFile = path.join(__dirname, 'empty.json');
    const badJsonFile = path.join(__dirname, 'badJson.json');

    beforeEach(() => {
        fs.writeFileSync(jsonFile,
            `[
                { "f1": 1, "f2": "text" },
                { "f2": "something", "f1": 2 }
            ]`);
        fs.writeFileSync(badJsonFile,
            `[,ds
                ds
                { "f1": 1, "f2": "text" },
                { "f2": "something", "f1": 2 }
            ]`);
        fs.writeFileSync(emptyFile,
            `[]`);
        fs.writeFileSync(invalidFile,
            `{ "f1": [1, 2], "f2": ["text", "something"] }`);
        
        fileService = jasmine.createSpyObj('FileService', ['openFile']);
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(jsonFile));
            })
        });

        reader = new JsonReader();
        reader.setFileService(fileService);
    });

    it('options should return one option', () => {
        const options = reader.getOptions();

        expect(options.options().length).toBe(1);
        expect(options.noMore()).toBeFalsy();
    });

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
    
    it('command should open file with contents', async () => {
        let options = reader.getOptions();
        await options.executeCommand('browse');
        const data = reader.fetch();
        
        
        options = reader.getOptions();
        expect(data.features).toEqual(['f1', 'f2']);
        expect(data.examples).toEqual([[1, "text"], [2, "something"]]);
        expect(options.noMore()).toBeTruthy();
    });

    it('command should throw for invalid file', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(invalidFile));
            });
        });

        try {
            await reader.getOptions().executeCommand('browse');
            done.fail();
        } catch (exception) {
            let options = reader.getOptions();
            expect(options.noMore()).toBeFalse();
            done();
        }

    });
    
    it('command should throw for empty file', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(emptyFile));
            });
        });

        try {
            await reader.getOptions().executeCommand('browse');
            done.fail();
        } catch (exception) {
            let options = reader.getOptions();
            expect(options.noMore()).toBeFalse();
            done();
        }
    });
    
    it('command should throw for bad json file', async (done) => {
        (fileService.openFile as jasmine.Spy).and.callFake(() => {
            return new Promise<Buffer>((resolve) => {
                resolve(fs.readFileSync(badJsonFile));
            });
        });

        try {
            await reader.getOptions().executeCommand('browse');
            done.fail();
        } catch (exception) {
            let options = reader.getOptions();
            expect(options.noMore()).toBeFalse();
            done();
        }
    });

});


