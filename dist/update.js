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
var child_process_1 = require("child_process");
var path_1 = require("path");
var installations_1 = require("./installations");
var lockfile_1 = require("./lockfile");
var _1 = require(".");
exports.updatePackages = function (packages, options) { return __awaiter(_this, void 0, void 0, function () {
    var workingDir, lockfile, packagesToUpdate, installationsToRemove, lockPackages, purePackagesFiles, nonPurePackagesFiles, packagesLinks, packagesLinkDep, packagesPure, _i, packages_1, packageName, pkg, postupdate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                workingDir = options.workingDir;
                lockfile = lockfile_1.readLockfile({ workingDir: workingDir });
                packagesToUpdate = [];
                installationsToRemove = [];
                if (packages.length) {
                    packages.forEach(function (packageName) {
                        var _a = _1.parsePackageName(packageName), name = _a.name, version = _a.version;
                        if (lockfile.packages[name]) {
                            if (version) {
                                lockfile.packages[name].version = version;
                            }
                            packagesToUpdate.push(name);
                        }
                        else {
                            installationsToRemove.push({ name: name, path: options.workingDir });
                            console.log("Did not find package " + name + " in lockfile, " +
                                "please use 'add' command to add it explicitly.");
                        }
                    });
                }
                else {
                    packagesToUpdate = Object.keys(lockfile.packages);
                }
                lockPackages = packagesToUpdate.map(function (name) { return ({
                    name: lockfile.packages[name].version
                        ? name + '@' + lockfile.packages[name].version
                        : name,
                    file: lockfile.packages[name].file,
                    link: lockfile.packages[name].link,
                    pure: lockfile.packages[name].pure
                }); });
                purePackagesFiles = lockPackages
                    .filter(function (p) { return p.file && p.pure; })
                    .map(function (p) { return p.name; });
                return [4 /*yield*/, _1.addPackages(purePackagesFiles, {
                        workingDir: options.workingDir,
                        pure: true,
                        yarn: false
                    })];
            case 1:
                _a.sent();
                nonPurePackagesFiles = lockPackages
                    .filter(function (p) { return p.file && !p.pure; })
                    .map(function (p) { return p.name; });
                return [4 /*yield*/, _1.addPackages(nonPurePackagesFiles, {
                        workingDir: options.workingDir,
                        pure: false,
                        yarn: false
                    })];
            case 2:
                _a.sent();
                packagesLinks = lockPackages
                    .filter(function (p) { return !p.file && !p.link && !p.pure; })
                    .map(function (p) { return p.name; });
                return [4 /*yield*/, _1.addPackages(packagesLinks, {
                        workingDir: options.workingDir,
                        link: true,
                        pure: false,
                        yarn: false
                    })];
            case 3:
                _a.sent();
                packagesLinkDep = lockPackages.filter(function (p) { return p.link; }).map(function (p) { return p.name; });
                return [4 /*yield*/, _1.addPackages(packagesLinkDep, {
                        workingDir: options.workingDir,
                        linkDep: true,
                        pure: false,
                        yarn: false
                    })];
            case 4:
                _a.sent();
                packagesPure = lockPackages.filter(function (p) { return p.pure; }).map(function (p) { return p.name; });
                return [4 /*yield*/, _1.addPackages(packagesPure, {
                        workingDir: options.workingDir,
                        pure: true,
                        yarn: false
                    })];
            case 5:
                _a.sent();
                for (_i = 0, packages_1 = packages; _i < packages_1.length; _i++) {
                    packageName = packages_1[_i];
                    pkg = _1.readPackageManifest(path_1.join(options.workingDir, _1.values.yalcPackagesFolder, packageName));
                    postupdate = pkg && pkg.scripts && pkg.scripts.postupdate;
                    if (postupdate) {
                        console.log("Running postupdate script of package " + packageName + " in " + workingDir);
                        child_process_1.execSync(postupdate, { cwd: workingDir });
                    }
                }
                if (!!options.noInstallationsRemove) return [3 /*break*/, 7];
                return [4 /*yield*/, installations_1.removeInstallations(installationsToRemove)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/, installationsToRemove];
        }
    });
}); };
//# sourceMappingURL=update.js.map