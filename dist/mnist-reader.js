"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_science_lab_core_1 = require("data-science-lab-core");
var zlib = require("zlib");
var MnistReader = /** @class */ (function (_super) {
    __extends(MnistReader, _super);
    function MnistReader() {
        var _this = _super.call(this) || this;
        _this.images = [];
        _this.labels = [];
        _this.options = new MnistReaderPluginOptions(_this);
        return _this;
    }
    MnistReader.prototype.setFileService = function (fileService) {
        this.fileService = fileService;
    };
    MnistReader.prototype.fetch = function () {
        var _this = this;
        if (this.images.length !== this.labels.length) {
            throw new Error("Mnist Reader image and label files were not the same length.");
        }
        if (this.images.length > 0 && this.labels.length > 0) {
            return {
                features: ['image', 'label'],
                examples: this.images.map(function (value, index) { return [value, _this.labels[index]]; })
            };
        }
        throw new Error("Mnist Reader was unable to fetch both image and label dataset.");
    };
    MnistReader.prototype.getOptions = function () {
        return this.options;
    };
    MnistReader.prototype.fetchImages = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var buffer, amount, width, height, image, pixels, y, x;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.fileService) === null || _a === void 0 ? void 0 : _a.openFile([{
                                name: 'Image Dataset (.gz)', extensions: ['gz']
                            }]))];
                    case 1:
                        buffer = _b.sent();
                        if (buffer === undefined) {
                            throw new Error("Mnist Reader found no data inside the file.");
                        }
                        buffer = zlib.unzipSync(buffer);
                        if (buffer.length < 16) {
                            throw new Error("Mnist Reader didn't find a valid header in file. ");
                        }
                        amount = buffer.readInt32BE(4);
                        width = buffer.readInt32BE(8);
                        height = buffer.readInt32BE(12);
                        this.images = [];
                        if (buffer.length !== amount * height * width + 16) {
                            throw new Error('Mnist Reader found images file length didn\'t match header.');
                        }
                        for (image = 0; image < amount; ++image) {
                            pixels = [];
                            for (y = 0; y < height; y++) {
                                for (x = 0; x < width; x++) {
                                    pixels.push(buffer[(image * height * width) + (x + (y * width) + 16)]);
                                }
                            }
                            this.images.push(pixels);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MnistReader.prototype.fetchLabels = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var buffer, amount, image;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.fileService) === null || _a === void 0 ? void 0 : _a.openFile([{
                                name: 'Label Dataset (.gz)', extensions: ['gz']
                            }]))];
                    case 1:
                        buffer = _b.sent();
                        if (buffer === undefined) {
                            throw new Error("Mnist Reader found no data inside the file.");
                        }
                        buffer = zlib.unzipSync(buffer);
                        if (buffer.length < 8) {
                            throw new Error("Mnist Reader didn't find a valid header in file. ");
                        }
                        amount = buffer.readInt32BE(4);
                        if (buffer.length !== amount + 8) {
                            throw new Error('Mnist Reader found label file length didn\'t match header.');
                        }
                        this.labels = [];
                        for (image = 0; image < amount; ++image) {
                            this.labels.push(buffer[image + 8]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return MnistReader;
}(data_science_lab_core_1.FetchPlugin));
exports.MnistReader = MnistReader;
var MnistReaderPluginOptions = /** @class */ (function (_super) {
    __extends(MnistReaderPluginOptions, _super);
    function MnistReaderPluginOptions(reader) {
        var _this = _super.call(this) || this;
        _this.reader = reader;
        _this.state = 1;
        return _this;
    }
    MnistReaderPluginOptions.prototype.submit = function (_) {
        throw new Error("Mnist Reader has no submit options.");
    };
    MnistReaderPluginOptions.prototype.options = function () {
        switch (this.state) {
            case 1:
                return [
                    new data_science_lab_core_1.CommandOption({ id: 'images', label: 'Browse for images file', command: 'images' })
                ];
            case 2:
                return [
                    new data_science_lab_core_1.CommandOption({ id: 'labels', label: 'Browse for labels file', command: 'labels' })
                ];
            default:
                throw new Error("Mnist Reader in invalid state.");
        }
    };
    MnistReaderPluginOptions.prototype.noMore = function () {
        return this.state === 3;
    };
    MnistReaderPluginOptions.prototype.executeCommand = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cmd === 'images')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reader.fetchImages()];
                    case 1:
                        _a.sent();
                        this.state = 2;
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(cmd === 'labels')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reader.fetchLabels()];
                    case 3:
                        _a.sent();
                        this.state = 3;
                        return [3 /*break*/, 5];
                    case 4: throw new Error("Mnist Reader recieved invalid command " + cmd);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return MnistReaderPluginOptions;
}(data_science_lab_core_1.PluginOptions));
