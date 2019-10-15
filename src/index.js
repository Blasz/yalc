'use strict'
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
Object.defineProperty(exports, '__esModule', { value: true })
var child_process_1 = require('child_process')
var fs = require('fs-extra')
var path_1 = require('path')
var userHome = require('user-home')
exports.values = {
  myNameIs: 'yalc',
  ignoreFileName: '.yalcignore',
  myNameIsCapitalized: 'Yalc',
  lockfileName: 'yalc.lock',
  yalcPackagesFolder: '.yalc',
  prescript: 'preyalc',
  postscript: 'postyalc',
  installationsFile: 'installations.json'
}
var publish_1 = require('./publish')
exports.publishPackage = publish_1.publishPackage
var update_1 = require('./update')
exports.updatePackages = update_1.updatePackages
var check_1 = require('./check')
exports.checkManifest = check_1.checkManifest
var remove_1 = require('./remove')
exports.removePackages = remove_1.removePackages
var add_1 = require('./add')
exports.addPackages = add_1.addPackages
exports.yalcGlobal = global
function getStoreMainDir() {
  if (exports.yalcGlobal.yalcStoreMainDir) {
    return exports.yalcGlobal.yalcStoreMainDir
  }
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return path_1.join(
      process.env.LOCALAPPDATA,
      exports.values.myNameIsCapitalized
    )
  }
  return path_1.join(userHome, '.' + exports.values.myNameIs)
}
exports.getStoreMainDir = getStoreMainDir
function getStorePackagesDir() {
  return path_1.join(getStoreMainDir(), 'packages')
}
exports.getStorePackagesDir = getStorePackagesDir
exports.getPackageStoreDir = function(packageName, version) {
  if (version === void 0) {
    version = ''
  }
  return path_1.join(getStorePackagesDir(), packageName, version)
}
exports.getPackageManager = function(cwd) {
  return fs.existsSync(path_1.join(cwd, 'yarn.lock')) ? 'yarn' : 'npm'
}
exports.getPackageManagerInstallCmd = function(cwd) {
  return exports.getPackageManager(cwd) === 'yarn' ? 'yarn' : 'npm install'
}
exports.execLoudOptions = { stdio: 'inherit' }
exports.parsePackageName = function(packageName) {
  var match = packageName.match(/(^@[^/]+\/)?([^@]+)@?(.*)/) || []
  if (!match) {
    return { name: '', version: '' }
  }
  return {
    name: (match[1] || '') + match[2],
    version: match[3] || ''
  }
}
var getJSONSpaces = function(jsonStr) {
  var match = jsonStr.match(/^[^{]*{.*\n([ ]+?)\S/)
  return match && match[1] ? match[1].length : null
}
function readPackageManifest(workingDir) {
  var pkg
  var packagePath = path_1.join(workingDir, 'package.json')
  try {
    var fileData = fs.readFileSync(packagePath, 'utf-8')
    pkg = JSON.parse(fileData)
    if (!pkg.name && pkg.version) {
      console.log(
        'Package manifest',
        packagePath,
        'should contain name and version.'
      )
      return null
    }
    var formatSpaces = getJSONSpaces(fileData) || 2
    if (!formatSpaces) {
      console.log('Could not get JSON formatting for', packagePath, 'using 2')
    }
    pkg.__JSONSpaces = formatSpaces
    return pkg
  } catch (e) {
    console.error('Could not read', packagePath)
    return null
  }
}
exports.readPackageManifest = readPackageManifest
var signatureFileName = 'yalc.sig'
exports.readSignatureFile = function(workingDir) {
  var signatureFilePath = path_1.join(workingDir, signatureFileName)
  try {
    var fileData = fs.readFileSync(signatureFilePath, 'utf-8')
    return fileData
  } catch (e) {
    return ''
  }
}
exports.readIgnoreFile = function(workingDir) {
  var filePath = path_1.join(workingDir, exports.values.ignoreFileName)
  try {
    var fileData = fs.readFileSync(filePath, 'utf-8')
    return fileData
  } catch (e) {
    return ''
  }
}
exports.writeSignatureFile = function(workingDir, signature) {
  var signatureFilePath = path_1.join(workingDir, signatureFileName)
  try {
    fs.writeFileSync(signatureFilePath, signature)
  } catch (e) {
    console.log('Could not write signature file')
    throw e
  }
}
var sortDependencies = function(dependencies) {
  return Object.keys(dependencies)
    .sort()
    .reduce(function(deps, key) {
      var _a
      return Object.assign(deps, ((_a = {}), (_a[key] = dependencies[key]), _a))
    }, {})
}
function writePackageManifest(workingDir, pkg) {
  pkg = Object.assign({}, pkg)
  if (pkg.dependencies) {
    pkg.dependencies = sortDependencies(pkg.dependencies)
  }
  if (pkg.devDependencies) {
    pkg.devDependencies = sortDependencies(pkg.devDependencies)
  }
  var formatSpaces = pkg.__JSONSpaces
  delete pkg.__JSONSpaces
  var packagePath = path_1.join(workingDir, 'package.json')
  try {
    fs.writeFileSync(
      packagePath,
      JSON.stringify(pkg, null, formatSpaces) + '\n'
    )
  } catch (e) {
    console.error('Could not write ', packagePath)
  }
}
exports.writePackageManifest = writePackageManifest
exports.isYarn = function(cwd) {
  return exports.getPackageManager(cwd) === 'yarn'
}
exports.runOrWarnPackageManagerInstall = function(workingDir, doRun) {
  var pkgMgrCmd = exports.getPackageManagerInstallCmd(workingDir)
  if (doRun) {
    console.log('Running ' + pkgMgrCmd + ' in ' + workingDir)
    child_process_1.execSync(
      pkgMgrCmd,
      __assign({ cwd: workingDir }, exports.execLoudOptions)
    )
  } else {
    console.log(
      "Don't forget you may need to run " +
        pkgMgrCmd +
        ' after adding packages with yalc to install/update dependencies/bin scripts.'
    )
  }
}
//# sourceMappingURL=index.js.map
