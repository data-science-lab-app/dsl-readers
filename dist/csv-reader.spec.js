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
var csv_reader_1 = require("./csv-reader");
var path = require("path");
var fs = require("fs");
describe('Data Science Lab Csv Reader', function () {
    var reader;
    var fileService;
    var csvFile = path.join(__dirname, 'file.csv');
    var periodsvFile = path.join(__dirname, 'period.csv');
    var noHeaderFile = path.join(__dirname, 'noHeader.csv');
    var emptyFile = path.join(__dirname, 'empty.csv');
    beforeEach(function () {
        fs.writeFileSync(csvFile, "numbers, \tstring\n" +
            "1,\tone\t\r\n\n" +
            "2,\ttwo \r\n");
        fs.writeFileSync(periodsvFile, "numbers . \tstring\n" +
            "1 .\tone\t\r\n\n" +
            "2 .\ttwo \r\n");
        fs.writeFileSync(noHeaderFile, "1,\tone\t\r\n\n" +
            "2,\ttwo \r\n");
        fs.writeFileSync(emptyFile, '');
        fileService = jasmine.createSpyObj('FileService', ['openFile']);
        fileService.openFile.and.callFake(function () {
            return new Promise(function (resolve) {
                resolve(fs.readFileSync(csvFile));
            });
        });
        reader = new csv_reader_1.CsvReader();
        reader.setFileService(fileService);
    });
    it('options should return two options', function () {
        var options = reader.getOptions();
        expect(options.options().length).toBe(2);
        expect(options.noMore()).toBeFalsy();
    });
    it('options after submit should return one option', function () {
        var options = reader.getOptions();
        options.submit({ headers: true, seperator: '' });
        expect(options.options().length).toBe(1);
        expect(options.noMore()).toBeFalsy();
    });
    it('submit twice should throw error', function () {
        var options = reader.getOptions();
        options.submit({ headers: true, seperator: '' });
        expect(function () {
            options.submit({ headers: true, seperator: '' });
        }).toThrowError();
    });
    it('command should throw error for cmd', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var options, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = reader.getOptions();
                    options.submit({ headers: true, seperator: '' });
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
    it('submit and command should open file with contents', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = reader.getOptions();
                    options.submit({ headers: true, seperator: '' });
                    options = reader.getOptions();
                    return [4 /*yield*/, options.executeCommand('browse')];
                case 1:
                    _a.sent();
                    data = reader.fetch();
                    expect(data.features).toEqual(['numbers', 'string']);
                    expect(data.examples).toEqual([[1, "one"], [2, "two"]]);
                    expect(options.noMore()).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('submit and command should open file with contents seperated form period.', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(fs.readFileSync(periodsvFile));
                        });
                    });
                    options = reader.getOptions();
                    options.submit({ headers: true, seperator: '.' });
                    options = reader.getOptions();
                    return [4 /*yield*/, options.executeCommand('browse')];
                case 1:
                    _a.sent();
                    data = reader.fetch();
                    expect(data.features).toEqual(['numbers', 'string']);
                    expect(data.examples).toEqual([[1, "one"], [2, "two"]]);
                    expect(options.noMore()).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('submit and command should open file with contents and no header', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(fs.readFileSync(noHeaderFile));
                        });
                    });
                    options = reader.getOptions();
                    options.submit({ headers: false, seperator: ',' });
                    return [4 /*yield*/, options.executeCommand('browse')];
                case 1:
                    _a.sent();
                    data = reader.fetch();
                    expect(data.features).toEqual(['feature 1', 'feature 2']);
                    expect(data.examples).toEqual([[1, "one"], [2, "two"]]);
                    expect(options.noMore()).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty file should throw for no content', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var options, exception_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (resolve) {
                            resolve(fs.readFileSync(emptyFile));
                        });
                    });
                    options = reader.getOptions();
                    options.submit({ headers: false, seperator: ',' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, options.executeCommand('browse')];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 4];
                case 3:
                    exception_1 = _a.sent();
                    expect(options.noMore()).toBeFalsy();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('open file should throw error', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var options, exception_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileService.openFile.and.callFake(function () {
                        return new Promise(function (_, reject) {
                            reject(new Error('New error'));
                        });
                    });
                    options = reader.getOptions();
                    options.submit({ headers: false, seperator: ',' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, options.executeCommand('browse')];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3 /*break*/, 4];
                case 3:
                    exception_2 = _a.sent();
                    expect(options.noMore()).toBeFalsy();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
