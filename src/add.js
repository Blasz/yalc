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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path_1 = require("path");
var sync_dir_1 = require("./sync-dir");
var installations_1 = require("./installations");
var lockfile_1 = require("./lockfile");
var _1 = require(".");
var ensureSymlinkSync = fs.ensureSymlinkSync;
var getLatestPackageVersion = function (packageName) {
    var dir = _1.getPackageStoreDir(packageName);
    var versions = fs.readdirSync(dir);
    var latest = versions
        .map(function (version) { return ({
        version: version,
        created: fs.statSync(path_1.join(dir, version)).ctime.getTime()
    }); })
        .sort(function (a, b) { return b.created - a.created; })
        .map(function (x) { return x.version; })[0];
    return latest || '';
};
var isSymlink = function (path) {
    try {
        return !!fs.readlinkSync(path);
    }
    catch (e) {
        return false;
    }
};
exports.addPackages = function (packages, options) { return __awaiter(_this, void 0, void 0, function () {
    var workingDir, localPkg, localPkgUpdated, doPure, addedInstallsP, addedInstalls;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!packages.length)
                    return [2 /*return*/];
                workingDir = options.workingDir;
                localPkg = _1.readPackageManifest(workingDir);
                localPkgUpdated = false;
                if (!localPkg) {
                    return [2 /*return*/];
                }
                doPure = options.pure === false ? false : options.pure || !!localPkg.workspaces;
                addedInstallsP = packages.map(function (packageName) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, name, _b, version, storedPackagePath, versionToInstall, storedPackageDir, pkg, destYalcCopyDir, storeCache, replacedVersion, destModulesDir, protocol, localAddress, dependencies, devDependencies, whereToAdd, binDir_1, addBinScript, name_1, addedAction, signature;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = _1.parsePackageName(packageName), name = _a.name, _b = _a.version, version = _b === void 0 ? '' : _b;
                                if (!name) {
                                    console.log('Could not parse package name', packageName);
                                }
                                storedPackagePath = _1.getPackageStoreDir(name);
                                if (!fs.existsSync(storedPackagePath)) {
                                    console.log("Could not find package `" + name + "` in store (" + storedPackagePath + "), skipping.");
                                    return [2 /*return*/, null];
                                }
                                versionToInstall = version || getLatestPackageVersion(name);
                                storedPackageDir = _1.getPackageStoreDir(name, versionToInstall);
                                if (!fs.existsSync(storedPackageDir)) {
                                    console.log("Could not find package `" + packageName + "` " + storedPackageDir, ', skipping.');
                                    return [2 /*return*/, null];
                                }
                                pkg = _1.readPackageManifest(storedPackageDir);
                                if (!pkg) {
                                    return [2 /*return*/];
                                }
                                destYalcCopyDir = path_1.join(workingDir, _1.values.yalcPackagesFolder, name);
                                storeCache = {};
                                return [4 /*yield*/, sync_dir_1.copyDirSafe(storedPackageDir, destYalcCopyDir, storeCache)];
                            case 1:
                                _c.sent();
                                replacedVersion = '';
                                if (doPure) {
                                    if (localPkg.workspaces) {
                                        if (!options.pure) {
                                            console.log('Because of `workspaces` enabled in this package,' +
                                                ' --pure option will be used by default, to override use --no-pure.');
                                        }
                                    }
                                    console.log(pkg.name + "@" + pkg.version + " added to " + path_1.join(_1.values.yalcPackagesFolder, name) + " purely");
                                }
                                if (!!doPure) return [3 /*break*/, 5];
                                destModulesDir = path_1.join(workingDir, 'node_modules', name);
                                if (options.link || options.linkDep || isSymlink(destModulesDir)) {
                                    fs.removeSync(destModulesDir);
                                }
                                if (!(options.link || options.linkDep)) return [3 /*break*/, 2];
                                ensureSymlinkSync(destYalcCopyDir, destModulesDir, 'junction');
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, sync_dir_1.copyDirSafe(storedPackageDir, destModulesDir, storeCache)];
                            case 3:
                                _c.sent();
                                _c.label = 4;
                            case 4:
                                if (!options.link) {
                                    protocol = options.linkDep ? 'link:' : 'file:';
                                    localAddress = protocol + _1.values.yalcPackagesFolder + '/' + pkg.name;
                                    dependencies = localPkg.dependencies || {};
                                    devDependencies = localPkg.devDependencies || {};
                                    whereToAdd = options.dev ? devDependencies : dependencies;
                                    if (options.dev) {
                                        if (dependencies[pkg.name]) {
                                            replacedVersion = dependencies[pkg.name];
                                            delete dependencies[pkg.name];
                                        }
                                    }
                                    else {
                                        if (!dependencies[pkg.name]) {
                                            if (devDependencies[pkg.name]) {
                                                whereToAdd = devDependencies;
                                            }
                                        }
                                    }
                                    if (whereToAdd[pkg.name] !== localAddress) {
                                        replacedVersion = replacedVersion || whereToAdd[pkg.name];
                                        whereToAdd[pkg.name] = localAddress;
                                        localPkg.dependencies =
                                            whereToAdd === dependencies ? dependencies : localPkg.dependencies;
                                        localPkg.devDependencies =
                                            whereToAdd === devDependencies
                                                ? devDependencies
                                                : localPkg.devDependencies;
                                        localPkgUpdated = true;
                                    }
                                    replacedVersion = replacedVersion == localAddress ? '' : replacedVersion;
                                }
                                if (pkg.bin) {
                                    binDir_1 = path_1.join(workingDir, 'node_modules', '.bin');
                                    addBinScript = function (src, dest) {
                                        var srcPath = path_1.join(destYalcCopyDir, src);
                                        var destPath = path_1.join(binDir_1, dest);
                                        ensureSymlinkSync(srcPath, destPath);
                                        fs.chmodSync(srcPath, 493);
                                    };
                                    if (typeof pkg.bin === 'string') {
                                        fs.ensureDirSync(binDir_1);
                                        addBinScript(pkg.bin, pkg.name);
                                    }
                                    else if (typeof pkg.bin === 'object') {
                                        fs.ensureDirSync(binDir_1);
                                        for (name_1 in pkg.bin) {
                                            addBinScript(pkg.bin[name_1], name_1);
                                        }
                                    }
                                }
                                addedAction = options.link ? 'linked' : 'added';
                                console.log("Package " + pkg.name + "@" + pkg.version + " " + addedAction + " ==> " + destModulesDir + ".");
                                _c.label = 5;
                            case 5:
                                signature = _1.readSignatureFile(storedPackageDir);
                                return [2 /*return*/, {
                                        signature: signature,
                                        name: name,
                                        version: version,
                                        replaced: replacedVersion,
                                        path: options.workingDir
                                    }];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(addedInstallsP)];
            case 1:
                addedInstalls = (_a.sent())
                    .filter(function (_) { return !!_; })
                    .map(function (_) { return _; });
                if (localPkgUpdated) {
                    _1.writePackageManifest(workingDir, localPkg);
                }
                lockfile_1.addPackageToLockfile(addedInstalls.map(function (i) { return ({
                    name: i.name,
                    version: i.version,
                    replaced: i.replaced,
                    pure: doPure,
                    file: !options.link && !options.linkDep && !doPure,
                    link: options.linkDep && !doPure,
                    signature: i.signature
                }); }), { workingDir: options.workingDir });
                return [4 /*yield*/, installations_1.addInstallations(addedInstalls)];
            case 2:
                _a.sent();
                _1.runOrWarnPackageManagerInstall(options.workingDir, options.yarn);
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=add.js.map