import { FetchPlugin, FileService, PluginData, PluginOptions, Option, CommandOption } from "data-science-lab-core";


export class JsonReader extends FetchPlugin {
    private fileService?: FileService;
    private dataset?: PluginData;
    private options: JsonReaderPluginOptions;

    constructor() {
        super();
        this.options = new JsonReaderPluginOptions(this);
    }

    setFileService(fileService: FileService) {
        this.fileService = fileService;
    }

    fetch(): PluginData {
        if (this.dataset) {
            return this.dataset;
        }
        throw new Error(`JSON Reader was unable to fetch the dataset.`);
    }

    getOptions(): PluginOptions {
        return this.options;
    }

    async browse(): Promise<void> {
        const buffer = await this.fileService?.openFile([{
            name: 'Dataset (.json)', extensions: ['json']
        }]);
        const json = JSON.parse(`${buffer}`);
        
        if (!(json instanceof Array)) {
            throw new Error(`JSON Reader expects an array of javascript objects.`)
        }
        if (json.length === 0) {
            throw new Error('JSON Reader found no data inside the file.');
        }

        const properties: {[id: string]: any[]} = {};

        for (const [key, _] of Object.entries(json[0])) {
            properties[key] = [];
        }

        for (const obj of json) {
            for (const [key, value] of Object.entries(obj)) {
                properties[key].push(value);                
            }
        }

        const features: string[] = [];
        const examples: any[][] = [];

        for (const [feature, values] of Object.entries(properties)) {
            
            features.push(feature);

            for (var i = 0; i < values.length; ++i) {
                if (examples.length <= i) {
                    examples.push([]);
                }
                examples[i].push(values[i])
            }
        }

        this.dataset = {
            features,
            examples
        };
    }
}

export class JsonReaderPluginOptions extends PluginOptions {
    finish: boolean;

    constructor(public reader: JsonReader) {
        super();
        this.finish = false;
    }

    submit(_: { [id: string]: any; }): void {
        throw new Error(`Json Reader has no submit options`);
    }

    options(): Option[] {
        return [
            new CommandOption({ id: 'browse', label: 'Browse for a file', command: 'Browse' })
        ];
    }

    async executeCommand(cmd: string): Promise<void> {
        if (cmd === 'browse') {
            await this.reader.browse();
            this.finish = true;
        } else {
            throw new Error(`Json Reader recieved invalid command ${cmd}`);
        }
    }

    noMore(): boolean {
        return this.finish;
    }


}