"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var crypto = require("crypto");
var npmPacklist = require("npm-packlist");
var ignore_1 = require("ignore");
var path_1 = require("path");
var _1 = require(".");
var _2 = require(".");
var shortSignatureLength = 8;
exports.getFileHash = function (srcPath, relPath) {
    if (relPath === void 0) { relPath = ''; }
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var stream, md5sum;
        return __generator(this, function (_a) {
            stream = fs.createReadStream(srcPath);
            md5sum = crypto.createHash('md5');
            md5sum.update(relPath.replace(/\\/g, '/'));
            stream.on('data', function (data) { return md5sum.update(data); });
            stream.on('error', reject).on('close', function () {
                resolve(md5sum.digest('hex'));
            });
            return [2 /*return*/];
        });
    }); });
};
var copyFile = function (srcPath, destPath, relPath) {
    if (relPath === void 0) { relPath = ''; }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.copy(srcPath, destPath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, exports.getFileHash(srcPath, relPath)];
            }
        });
    });
};
exports.copyPackageToStore = function (pkg, options) { return __awaiter(_this, void 0, void 0, function () {
    var workingDir, copyFromDir, storePackageStoreDir, ignoreFileContent, ignoreRule, npmList, filesToCopy, copyFilesToStore, hashes, _a, signature, publishedSig, ensureSymlinkSync_1, versionPre, pkgToWrite;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                workingDir = options.workingDir;
                copyFromDir = options.workingDir;
                storePackageStoreDir = path_1.join(_2.getStorePackagesDir(), pkg.name, pkg.version);
                ignoreFileContent = _1.readIgnoreFile(workingDir);
                ignoreRule = ignore_1.default().add(ignoreFileContent);
                return [4 /*yield*/, npmPacklist({ path: workingDir })];
            case 1:
                npmList = _b.sent();
                filesToCopy = npmList.filter(function (f) { return !ignoreRule.ignores(f); });
                if (options.files) {
                    console.log('Files included in published content:');
                    filesToCopy.forEach(function (f) {
                        console.log("- " + f);
                    });
                    console.log("Total " + filesToCopy.length + " files.");
                }
                copyFilesToStore = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fs.remove(storePackageStoreDir)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, Promise.all(filesToCopy
                                        .sort()
                                        .map(function (relPath) {
                                        return copyFile(path_1.join(copyFromDir, relPath), path_1.join(storePackageStoreDir, relPath), relPath);
                                    }))];
                        }
                    });
                }); };
                if (!options.changed) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.all(filesToCopy
                        .sort()
                        .map(function (relPath) { return exports.getFileHash(path_1.join(copyFromDir, relPath), relPath); }))];
            case 2:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, copyFilesToStore()];
            case 4:
                _a = _b.sent();
                _b.label = 5;
            case 5:
                hashes = _a;
                signature = crypto
                    .createHash('md5')
                    .update(hashes.join(''))
                    .digest('hex');
                if (!options.changed) return [3 /*break*/, 8];
                publishedSig = _1.readSignatureFile(storePackageStoreDir);
                if (!(signature === publishedSig)) return [3 /*break*/, 6];
                return [2 /*return*/, false];
            case 6: return [4 /*yield*/, copyFilesToStore()];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                if (options.knit) {
                    fs.removeSync(storePackageStoreDir);
                    ensureSymlinkSync_1 = fs.ensureSymlinkSync;
                    filesToCopy.forEach(function (f) {
                        var source = path_1.join(copyFromDir, f);
                        if (fs.statSync(source).isDirectory()) {
                            return;
                        }
                        ensureSymlinkSync_1(source, path_1.join(storePackageStoreDir, f));
                    });
                }
                _2.writeSignatureFile(storePackageStoreDir, signature);
                versionPre = options.signature && !options.knit
                    ? '-' + signature.substr(0, shortSignatureLength)
                    : '';
                pkgToWrite = __assign({}, pkg, { version: pkg.version + versionPre, devDependencies: undefined });
                _2.writePackageManifest(storePackageStoreDir, pkgToWrite);
                return [2 /*return*/, signature];
        }
    });
}); };
//# sourceMappingURL=copy.js.map