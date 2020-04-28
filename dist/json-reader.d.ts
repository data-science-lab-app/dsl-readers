import { FetchPlugin, FileService, PluginData, PluginOptions, Option } from "data-science-lab-core";
export declare class JsonReader extends FetchPlugin {
    private fileService?;
    private dataset?;
    private options;
    constructor();
    setFileService(fileService: FileService): void;
    fetch(): PluginData;
    getOptions(): PluginOptions;
    browse(): Promise<void>;
}
export declare class JsonReaderPluginOptions extends PluginOptions {
    reader: JsonReader;
    finish: boolean;
    constructor(reader: JsonReader);
    submit(_: {
        [id: string]: any;
    }): void;
    options(): Option[];
    executeCommand(cmd: string): Promise<void>;
    noMore(): boolean;
}
