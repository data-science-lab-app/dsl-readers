import { FetchPlugin, PluginOptions, PluginData, Option, FileService } from 'data-science-lab-core';
export declare class CsvReader extends FetchPlugin {
    private fileService?;
    private dataset?;
    private options;
    constructor();
    setFileService(fileService: FileService): void;
    fetch(): PluginData;
    getOptions(): PluginOptions;
    browse(hasHeaders: boolean, seperator: string): Promise<void>;
}
export declare class CsvReaderPluginOptions extends PluginOptions {
    reader: CsvReader;
    state: number;
    hasHeaders: boolean;
    seperator: string;
    constructor(reader: CsvReader);
    submit(inputs: {
        [id: string]: any;
    }): void;
    options(): Option[];
    noMore(): boolean;
    executeCommand(id: string): Promise<void>;
}
