"use strict";
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
var mnist_reader_1 = require("./mnist-reader");
var path = require("path");
var fs = require("fs");
var zlib = require("zlib");
describe('Data Science Lab Mnist Reader', function () {
    var reader;
    var fileService;
    var trainImageFile = path.join(__dirname, 'train-image.gz');
    var trainLabelFile = path.join(__dirname, 'train-labels.gz');
    var testLabelFile = path.join(__dirname, 'test-labels.gz');
    beforeAll(function () {
        var trainImageFileBuffer = Buffer.alloc(28);
        trainImageFileBuffer.writeInt32BE(3, 4); // three images of 2x2
        trainImageFileBuffer.writeInt32BE(2, 8); // rows
        trainImageFileBuffer.writeInt32BE(2, 12); // columns
        trainImageFileBuffer.writeInt8(1, 16); // first image 1,2,3,4
        trainImageFileBuffer.writeInt8(2, 17);
        trainImageFileBuffer.writeInt8(3, 18);
        trainImageFileBuffer.writeInt8(4, 19);
        trainImageFileBuffer.writeInt8(1, 20); // second image 1,2,3,4
        trainImageFileBuffer.writeInt8(2, 21);
        trainImageFileBuffer.writeInt8(3, 22);
        trainImageFileBuffer.writeInt8(4, 23);
        trainImageFileBuffer.writeInt8(1, 24); // third image 1,2,3,4
        trainImageFileBuffer.writeInt8(2, 25);
        trainImageFileBuffer.writeInt8(3, 26);
        trainImageFileBuffer.writeInt8(4, 27);
        fs.writeFileSync(trainImageFile, zlib.gzipSync(trainImageFileBuffer));
        var trainLabelsFileBuffer = Buffer.alloc(11);
        trainLabelsFileBuffer.writeInt32BE(3, 4); // three labels
        trainLabelsFileBuffer.writeInt8(1, 8); // first label 1
        trainLabelsFileBuffer.writeInt8(2, 9);
        trainLabelsFileBuffer.writeInt8(3, 10);
        fs.writeFileSync(trainLabelFile, zlib.gzipSync(trainLabelsFileBuffer));
        var testLabelsFileBuffer = Buffer.alloc(13);
        testLabelsFileBuffer.writeInt32BE(5, 4); // five labels
        testLabelsFileBuffer.writeInt8(1, 8); // first label 1
        testLabelsFileBuffer.writeInt8(2, 9);
        testLabelsFileBuffer.writeInt8(3, 10);
        testLabelsFileBuffer.writeInt8(4, 11);
        testLabelsFileBuffer.writeInt8(5, 12);
        fs.writeFileSync(testLabelFile, zlib.gzipSync(testLabelsFileBuffer));
    });
    beforeEach(function () {
        fileService = jasmine.createSpyObj('FileService', ['openFile']);
        fileService.openFile.and.callFake(function () {
            return new Promise(function (resolve) {
                resolve(fs.readFileSync(trainImageFile));
            });
        });
        reader = new mnist_reader_1.MnistReader();
        reader.setFileService(fileService);
    });
    it('options should return one option', function () {
        var options = reader.getOptions();
        expect(options.options().length).toBe(1);
        expect(options.noMore()).toBeFalsy();
    });
    it('option should throw error for fetch', function () {
        reader.getOptions();
        expect(function () {
            reader.fetch();
        }).toThrowError();
    });
    it('command should throw error for cmd', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var options, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = reader.getOptions();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, options.executeCommand('command')];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('command should open files', function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 1:
                    _a.sent();
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(fs.readFileSync(trainLabelFile));
                        });
                    });
                    return [4 /*yield*/, reader.getOptions().executeCommand('labels')];
                case 2:
                    _a.sent();
                    data = reader.fetch();
                    expect(data.features).toEqual(['image', 'label']);
                    expect(data.examples).toEqual([[[1, 2, 3, 4], 1], [[1, 2, 3, 4], 2], [[1, 2, 3, 4], 3]]);
                    expect(reader.getOptions().noMore()).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetch after command should throw', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 1:
                    _a.sent();
                    try {
                        reader.fetch();
                        done.fail();
                    }
                    catch (exception) {
                        expect().nothing();
                        done();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetch with different sizes should throw', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 1:
                    _a.sent();
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(fs.readFileSync(testLabelFile));
                        });
                    });
                    return [4 /*yield*/, reader.getOptions().executeCommand('labels')];
                case 2:
                    _a.sent();
                    try {
                        reader.fetch();
                        done.fail();
                    }
                    catch (error) {
                        expect().nothing();
                        done();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetch image should throw for undefined buffer', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve();
                        });
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('fetch label should throw for undefined buffer', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 1:
                    _a.sent();
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve();
                        });
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, reader.getOptions().executeCommand('labels')];
                case 3:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('fetch images should throw for invalid header', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(Buffer.alloc(16));
                        });
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('fetch labels should throw for invalid header', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 1:
                    _a.sent();
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(Buffer.alloc(8));
                        });
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, reader.getOptions().executeCommand('labels')];
                case 3:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('fetch images should throw for incorrect amount and size', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        var buffer = Buffer.alloc(19);
                        buffer.writeInt32BE(3, 4);
                        buffer.writeInt32BE(2, 8);
                        buffer.writeInt32BE(2, 12);
                        buffer.writeInt8(1, 16);
                        buffer.writeInt8(2, 17);
                        buffer.writeInt8(3, 18);
                        return new Promise(function (resolve) {
                            resolve(buffer);
                        });
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('fetch label should throw for incorrect amount and size', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reader.getOptions().executeCommand('images')];
                case 1:
                    _a.sent();
                    fileService.openFile.and.callFake(function () {
                        var buffer = Buffer.alloc(11);
                        buffer.writeInt32BE(4, 4); // three labels
                        buffer.writeInt8(1, 8); // first label 1
                        buffer.writeInt8(2, 9);
                        buffer.writeInt8(3, 10);
                        return new Promise(function (resolve) {
                            resolve(buffer);
                        });
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, reader.getOptions().executeCommand('labels')];
                case 3:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _a.sent();
                    expect().nothing();
                    done();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
