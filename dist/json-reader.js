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
var JsonReader = /** @class */ (function (_super) {
    __extends(JsonReader, _super);
    function JsonReader() {
        var _this = _super.call(this) || this;
        _this.options = new JsonReaderPluginOptions(_this);
        return _this;
    }
    JsonReader.prototype.setFileService = function (fileService) {
        this.fileService = fileService;
    };
    JsonReader.prototype.fetch = function () {
        if (this.dataset) {
            return this.dataset;
        }
        throw new Error("JSON Reader was unable to fetch the dataset.");
    };
    JsonReader.prototype.getOptions = function () {
        return this.options;
    };
    JsonReader.prototype.browse = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var buffer, json, properties, _i, _b, _c, key, _, _d, json_1, obj, _e, _f, _g, key, value, features, examples, _h, _j, _k, feature, values, i;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, ((_a = this.fileService) === null || _a === void 0 ? void 0 : _a.openFile([{
                                name: 'Dataset (.json)', extensions: ['json']
                            }]))];
                    case 1:
                        buffer = _l.sent();
                        json = JSON.parse("" + buffer);
                        if (!(json instanceof Array)) {
                            throw new Error("JSON Reader expects an array of javascript objects.");
                        }
                        if (json.length === 0) {
                            throw new Error('JSON Reader found no data inside the file.');
                        }
                        properties = {};
                        for (_i = 0, _b = Object.entries(json[0]); _i < _b.length; _i++) {
                            _c = _b[_i], key = _c[0], _ = _c[1];
                            properties[key] = [];
                        }
                        for (_d = 0, json_1 = json; _d < json_1.length; _d++) {
                            obj = json_1[_d];
                            for (_e = 0, _f = Object.entries(obj); _e < _f.length; _e++) {
                                _g = _f[_e], key = _g[0], value = _g[1];
                                properties[key].push(value);
                            }
                        }
                        features = [];
                        examples = [];
                        for (_h = 0, _j = Object.entries(properties); _h < _j.length; _h++) {
                            _k = _j[_h], feature = _k[0], values = _k[1];
                            features.push(feature);
                            for (i = 0; i < values.length; ++i) {
                                if (examples.length <= i) {
                                    examples.push([]);
                                }
                                examples[i].push(values[i]);
                            }
                        }
                        this.dataset = {
                            features: features,
                            examples: examples
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    return JsonReader;
}(data_science_lab_core_1.FetchPlugin));
exports.JsonReader = JsonReader;
var JsonReaderPluginOptions = /** @class */ (function (_super) {
    __extends(JsonReaderPluginOptions, _super);
    function JsonReaderPluginOptions(reader) {
        var _this = _super.call(this) || this;
        _this.reader = reader;
        _this.finish = false;
        return _this;
    }
    JsonReaderPluginOptions.prototype.submit = function (_) {
        throw new Error("Json Reader has no submit options.");
    };
    JsonReaderPluginOptions.prototype.options = function () {
        return [
            new data_science_lab_core_1.CommandOption({ id: 'browse', label: 'Browse for a file', command: 'Browse' })
        ];
    };
    JsonReaderPluginOptions.prototype.executeCommand = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cmd === 'browse')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reader.browse()];
                    case 1:
                        _a.sent();
                        this.finish = true;
                        return [3 /*break*/, 3];
                    case 2: throw new Error("Json Reader recieved invalid command " + cmd);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JsonReaderPluginOptions.prototype.noMore = function () {
        return this.finish;
    };
    return JsonReaderPluginOptions;
}(data_science_lab_core_1.PluginOptions));
exports.JsonReaderPluginOptions = JsonReaderPluginOptions;
