import { FetchPlugin, PluginOptions, PluginData, Option, CheckboxOption, CommandOption, FileService, TextOption } from 'data-science-lab-core';

export class CsvReader extends FetchPlugin {

    private fileService?: FileService;
    private dataset?: PluginData;

    constructor() {
        super();
    }

    setFileService(fileService: FileService) {
        this.fileService = fileService;
    }

    fetch(): PluginData {
        if (this.dataset) {
            return this.dataset;
        }
        throw new Error(`Csv Reader was unable to fetch dataset.`);
    }

    getOptions(): PluginOptions {
        return new CsvReaderPluginOptions(this);
    }

    async browse(hasHeaders: boolean, seperator: string): Promise<void> {
        const buffer = await this.fileService?.openFile([{
            name: "Dataset (.csv)", extensions: ['csv']
        }]);
        const features: string[] = [];
        const examples: any[][] = [];

        const lines = `${buffer}`.split('\n');
        
        if (lines.length === 0) {
            throw new Error('Csv Reader found no data inside the file.');    
        }

        if (hasHeaders) {
            for (const headers of lines[0].split(seperator)) {
                features.push(headers.trim());
            }
        }

        const start = hasHeaders ? 1 : 0;
        
        for (let row = start; row < lines.length; ++row) {
            examples.push([]);
            for (const column of lines[row].split(seperator)) {
                examples[row - 1].push(JSON.parse(column.trim()));
            }
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

                if (inputs['seperator'] === undefined || inputs['seperator'] === '') {
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
                    new TextOption({ id: 'seperator', label: 'Type a seperator or the default \',\' will be used.', min: 0  })   
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