import { FetchPlugin, PluginOptions, PluginData, Option, CheckboxOption, CommandOption, FileService, TextOption } from 'data-science-lab-core';

export class CsvReader extends FetchPlugin {

    private fileService?: FileService;
    private dataset?: PluginData;
    private options: CsvReaderPluginOptions;

    constructor() {
        super();
        this.options = new CsvReaderPluginOptions(this);
    }

    setFileService(fileService: FileService) {
        this.fileService = fileService;
    }

    fetch(): PluginData {
        if (this.dataset) {
            return this.dataset;
        }
        throw new Error(`Csv Reader was unable to fetch the dataset.`);
    }

    getOptions(): PluginOptions {
        return this.options;
    }

    async browse(hasHeaders: boolean, seperator: string): Promise<void> {
        const buffer = await this.fileService?.openFile([{
            name: "Dataset (.csv)", extensions: ['csv']
        }]);
        const features: string[] = [];
        const examples: any[][] = [];
        const lines = `${buffer}`.split('\n').filter((value) => value !== '');

        if (lines.length === 0) {
            throw new Error('Csv Reader found no data inside the file.');
        }

        if (hasHeaders) {
            for (const header of lines[0].split(seperator)) {
                features.push(header.trim());
            }
        } else {
            const headers = lines[0].split(seperator);
            for (let i = 0; i < headers.length; ++i) {
                features.push(`feature ${i + 1}`)
            }
        }

        const start = hasHeaders ? 1 : 0;

        let exampleRow = 0;
        for (let row = start; row < lines.length; ++row) {
            examples.push([]);
            for (const column of lines[row].split(seperator)) {
                const value = column.trim();
                try {
                    examples[exampleRow].push(JSON.parse(value));
                } catch (exception) {
                    examples[exampleRow].push(value);
                }
            }
            ++exampleRow;
        }

        this.dataset = {
            examples,
            features
        }
    }
}

export class CsvReaderPluginOptions extends PluginOptions {

    state: number;
    hasHeaders: boolean;
    seperator: string;

    constructor(public reader: CsvReader) {
        super();
        this.state = 1;
        this.hasHeaders = false;
        this.seperator = ',';
    }

    submit(inputs: { [id: string]: any; }): void {
        switch (this.state) {
            case 1:
                this.hasHeaders = inputs['headers'] as boolean;

                if (inputs['seperator'] === '') {
                    this.seperator = ',';
                } else {
                    this.seperator = inputs['seperator'] as string;
                }
                break;
            default:
                throw new Error(`Csv Reader in invalid state.`);
        }
        this.state += 1;
    }

    options(): Option[] {
        switch (this.state) {
            case 1:
                return [
                    new CheckboxOption({ id: 'headers', label: 'Does the file (.csv) contains feature headers? Check for yes.' }),
                    new TextOption({ id: 'seperator', label: 'Type a seperator or the default \',\' will be used.', min: 0 })
                ]
            case 2:
                return [
                    new CommandOption({ id: 'browse', label: 'Browse for a file', command: 'Browse' })
                ]
            default:
                throw new Error(`Csv Reader in invalid state.`);
        }
    }

    noMore(): boolean {
        return this.state === 3;
    }

    async executeCommand(cmd: string): Promise<void> {
        if (cmd === 'browse') {
            await this.reader.browse(this.hasHeaders, this.seperator);
            this.state = 3;
        } else {
            throw new Error(`Csv Reader recieved invalid command ${cmd}`);
        }
    }

}