"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("glob");
var util = require("util");
var path_1 = require("path");
var fs = require("fs-extra");
var copy_1 = require("./copy");
var NODE_MAJOR_VERSION = parseInt(process.versions.node.split('.').shift(), 10);
if (NODE_MAJOR_VERSION >= 8 && NODE_MAJOR_VERSION < 10) {
    // Symbol.asyncIterator polyfill for Node 8 + 9
    ;
    Symbol.asyncIterator =
        Symbol.asyncIterator || Symbol('Symbol.asyncIterator');
}
var globP = util.promisify(glob);
var makeListMap = function (list) {
    return list.reduce(function (map, item) {
        map[item] = true;
        return map;
    }, {});
};
var theSameStats = function (srcStat, destStat) {
    return (srcStat.mtime.getTime() === destStat.mtime.getTime() &&
        srcStat.size === destStat.size);
};
exports.copyDirSafe = function (srcDir, destDir, cache) {
    if (cache === void 0) { cache = {}; }
    return __awaiter(_this, void 0, void 0, function () {
        var ignore, dot, nodir, srcList, _a, destList, srcMap, destMap, newFiles, filesToRemove, commonFiles, filesToReplace, srcCached, commonFiles_1, commonFiles_1_1, file, srcFilePath, destFilePath, srcFileStat, _b, destFileStat, compareByHash, _c, e_1_1;
        var _this = this;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    ignore = '**/node_modules/**';
                    dot = true;
                    nodir = true;
                    if (!cache[srcDir]) return [3 /*break*/, 1];
                    _a = cache[srcDir].glob;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, globP('**', { cwd: srcDir, ignore: ignore, dot: dot, nodir: nodir })];
                case 2:
                    _a = _e.sent();
                    _e.label = 3;
                case 3:
                    srcList = _a;
                    return [4 /*yield*/, globP('**', { cwd: destDir, ignore: ignore, dot: dot, nodir: nodir })];
                case 4:
                    destList = _e.sent();
                    srcMap = makeListMap(srcList);
                    destMap = makeListMap(destList);
                    newFiles = srcList.filter(function (file) { return !destMap[file]; });
                    filesToRemove = destList.filter(function (file) { return !srcMap[file]; });
                    commonFiles = srcList.filter(function (file) { return destMap[file]; });
                    cache[srcDir] = cache[srcDir] || {
                        files: {},
                        glob: srcList
                    };
                    filesToReplace = [];
                    srcCached = cache[srcDir].files;
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 15, 16, 21]);
                    commonFiles_1 = __asyncValues(commonFiles);
                    _e.label = 6;
                case 6: return [4 /*yield*/, commonFiles_1.next()];
                case 7:
                    if (!(commonFiles_1_1 = _e.sent(), !commonFiles_1_1.done)) return [3 /*break*/, 14];
                    file = commonFiles_1_1.value;
                    srcCached[file] = srcCached[file] || {};
                    srcFilePath = path_1.resolve(srcDir, file);
                    destFilePath = path_1.resolve(destDir, file);
                    _b = srcCached[file].stat;
                    if (_b) return [3 /*break*/, 9];
                    return [4 /*yield*/, fs.stat(srcFilePath)];
                case 8:
                    _b = (_e.sent());
                    _e.label = 9;
                case 9:
                    srcFileStat = _b;
                    srcCached[file].stat = srcFileStat;
                    return [4 /*yield*/, fs.stat(destFilePath)];
                case 10:
                    destFileStat = _e.sent();
                    compareByHash = function () { return __awaiter(_this, void 0, void 0, function () {
                        var srcHash, _a, destHash;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = srcCached[file].hash;
                                    if (_a) return [3 /*break*/, 2];
                                    return [4 /*yield*/, copy_1.getFileHash(srcFilePath, '')];
                                case 1:
                                    _a = (_b.sent());
                                    _b.label = 2;
                                case 2:
                                    srcHash = _a;
                                    srcCached[file].hash = srcHash;
                                    return [4 /*yield*/, copy_1.getFileHash(destFilePath, '')];
                                case 3:
                                    destHash = _b.sent();
                                    return [2 /*return*/, srcHash === destHash];
                            }
                        });
                    }); };
                    _c = !theSameStats(srcFileStat, destFileStat);
                    if (!_c) return [3 /*break*/, 12];
                    return [4 /*yield*/, compareByHash()];
                case 11:
                    _c = !(_e.sent());
                    _e.label = 12;
                case 12:
                    if (_c) {
                        filesToReplace.push(file);
                    }
                    _e.label = 13;
                case 13: return [3 /*break*/, 6];
                case 14: return [3 /*break*/, 21];
                case 15:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 21];
                case 16:
                    _e.trys.push([16, , 19, 20]);
                    if (!(commonFiles_1_1 && !commonFiles_1_1.done && (_d = commonFiles_1.return))) return [3 /*break*/, 18];
                    return [4 /*yield*/, _d.call(commonFiles_1)];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18: return [3 /*break*/, 20];
                case 19:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 20: return [7 /*endfinally*/];
                case 21: 
                // console.log('newFiles', newFiles)
                // console.log('filesToRemove', filesToRemove)
                // console.log('filesToReplace', filesToReplace)
                return [4 /*yield*/, Promise.all(newFiles
                        .concat(filesToReplace)
                        .map(function (file) { return fs.copy(path_1.resolve(srcDir, file), path_1.resolve(destDir, file)); }))];
                case 22:
                    // console.log('newFiles', newFiles)
                    // console.log('filesToRemove', filesToRemove)
                    // console.log('filesToReplace', filesToReplace)
                    _e.sent();
                    return [4 /*yield*/, Promise.all(filesToRemove.map(function (file) { return fs.remove(path_1.resolve(destDir, file)); }))];
                case 23:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=sync-dir.js.map