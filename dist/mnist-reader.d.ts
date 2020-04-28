import { FetchPlugin, FileService, PluginData, PluginOptions } from 'data-science-lab-core';
export declare class MnistReader extends FetchPlugin {
    private fileService?;
    private images;
    private labels;
    private options;
    constructor();
    setFileService(fileService: FileService): void;
    fetch(): PluginData;
    getOptions(): PluginOptions;
    fetchImages(): Promise<void>;
    fetchLabels(): Promise<void>;
}
