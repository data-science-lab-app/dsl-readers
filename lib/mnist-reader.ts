import { FetchPlugin, FileService, PluginData, PluginOptions, Option, CommandOption } from 'data-science-lab-core';
import { CsvReaderPluginOptions } from './csv-reader';
import * as zlib from 'zlib';

export class MnistReader extends FetchPlugin {
    private fileService?: FileService;
    private images: any[];
    private labels: any[];
    private options: MnistReaderPluginOptions;

    constructor() {
        super();
        this.images = [];
        this.labels = [];
        this.options = new MnistReaderPluginOptions(this);
    }

    setFileService(fileService: FileService) {
        this.fileService = fileService;
    }

    fetch(): PluginData {
        if (this.images.length !== this.labels.length) {
            throw new Error(`Mnist Reader image and label files were not the same length.`);
        }
        if (this.images.length > 0 && this.labels.length > 0) {
            return {
                features: ['image', 'label'],
                examples: this.images.map((value, index) => [value, this.labels[index]])
            }
        }
        throw new Error(`Mnist Reader was unable to fetch both image and label dataset.`);
    }

    getOptions(): PluginOptions {
        return this.options;
    }

    async fetchImages(): Promise<void> {
        let buffer = await this.fileService?.openFile([{
            name: 'Image Dataset (.gz)', extensions: ['gz']
        }]);
        if (buffer === undefined) {
            throw new Error(`Mnist Reader found no data inside the file.`);
        }
        buffer = zlib.unzipSync(buffer);
        if (buffer.length < 16) {
            throw new Error(`Mnist Reader didn't find a valid header in file. `)
        }
        const amount = buffer.readInt32BE(4);
        const width = buffer.readInt32BE(8);
        const height = buffer.readInt32BE(12);
        this.images = [];
        
        if (buffer.length !== amount * height * width + 16) {
            throw new Error('Mnist Reader found images file length didn\'t match header.')
        }

        for (var image = 0; image < amount; ++image) {
            var pixels = [];

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    pixels.push(buffer[(image * height * width) + (x + (y * width) + 16)]);
                }
            }

            this.images.push(pixels);
        }
    }

    async fetchLabels(): Promise<void> {
        let buffer = await this.fileService?.openFile([{
            name: 'Label Dataset (.gz)', extensions: ['gz']
        }]);
        if (buffer === undefined) {
            throw new Error(`Mnist Reader found no data inside the file.`);
        }

        buffer = zlib.unzipSync(buffer);
        if (buffer.length < 8) {
            throw new Error(`Mnist Reader didn't find a valid header in file. `)
        }
        const amount = buffer.readInt32BE(4);
        
        if (buffer.length !== amount + 8) {
            throw new Error('Mnist Reader found label file length didn\'t match header.')
        }

        this.labels = [];
        for (var image = 0; image < amount; ++image) {
            this.labels.push(buffer[image + 8]);
        }
    }
}


export class MnistReaderPluginOptions extends PluginOptions {
    state: number;

    constructor(public reader: MnistReader) {
        super();

        this.state = 1;
    }

    submit(_: { [id: string]: any }): void {
        throw new Error(`Mnist Reader has no submit options.`);
    }

    options(): Option[] {
        switch (this.state) {
            case 1:
                return [
                    new CommandOption({ id: 'images', label: 'Browse for images file', command: 'images' })
                ]
            case 2:
                return [
                    new CommandOption({ id: 'labels', label: 'Browse for labels file', command: 'labels' })
                ]
            default:
                throw new Error(`Mnist Reader in invalid state.`);
        }
    }

    noMore(): boolean {
        return this.state === 3;
    }

    async executeCommand(cmd: string): Promise<void> {
        if (cmd === 'images') {
            await this.reader.fetchImages();
            this.state = 2;
        } else if (cmd === 'labels') {
            await this.reader.fetchLabels();
            this.state = 3;
        } else {
            throw new Error(`Mnist Reader recieved invalid command ${cmd}`);
        }
    }
}