'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var fs = require('fs-extra')
var assert_1 = require('assert')
var path_1 = require('path')
var src_1 = require('../src')
var installations_1 = require('../src/installations')
var lockfile_1 = require('../src/lockfile')
var values = {
  depPackage: 'dep-package',
  depPackageVersion: '1.0.0',
  depPackage2: 'dep-package2',
  depPackage2Version: '1.0.0',
  storeDir: 'yalc-store',
  project: 'project'
}
var fixtureDir = path_1.join(__dirname, 'fixture')
var tmpDir = path_1.join(__dirname, 'tmp')
var shortSignatureLength = 8
var storeMainDr = path_1.join(tmpDir, values.storeDir)
src_1.yalcGlobal.yalcStoreMainDir = storeMainDr
var depPackageDir = path_1.join(tmpDir, values.depPackage)
var depPackage2Dir = path_1.join(tmpDir, values.depPackage2)
var projectDir = path_1.join(tmpDir, values.project)
var publishedPackagePath = path_1.join(
  storeMainDr,
  'packages',
  values.depPackage,
  values.depPackageVersion
)
var publishedPackage2Path = path_1.join(
  storeMainDr,
  'packages',
  values.depPackage2,
  values.depPackage2Version
)
var checkExists = function(path) {
  return assert_1.doesNotThrow(function() {
    return fs.accessSync(path)
  }, path + ' does not exist')
}
var checkNotExists = function(path) {
  return assert_1.throws(function() {
    return fs.accessSync(path)
  }, path + ' exists')
}
var extractSignature = function(lockfile, packageName) {
  var packageEntry = lockfile.packages[packageName]
  if (packageEntry === undefined) {
    throw new Error(
      'expected package ' +
        packageName +
        ' in lockfile.packages ' +
        JSON.stringify(lockfile, undefined, 2)
    )
  }
  var signature = packageEntry.signature
  if (signature === undefined) {
    throw new Error(
      'expected signature property in lockfile.packages.' +
        packageName +
        ' ' +
        JSON.stringify(lockfile, undefined, 2)
    )
  }
  return signature
}
describe('Yalc package manager', function() {
  this.timeout(60000)
  before(function() {
    fs.removeSync(tmpDir)
    fs.copySync(fixtureDir, tmpDir)
  })
  describe('Package publish', function() {
    this.timeout(5000)
    before(function() {
      console.time('Package publish')
      return src_1
        .publishPackage({
          workingDir: depPackageDir,
          signature: true
        })
        .then(function() {
          console.timeEnd('Package publish')
        })
    })
    it('publishes package to store', function() {
      checkExists(publishedPackagePath)
    })
    it('copies package.json npm includes', function() {
      checkExists(path_1.join(publishedPackagePath, 'package.json'))
    })
    it('ignores standard non-code', function() {
      checkNotExists(path_1.join(publishedPackagePath, 'extra-file.txt'))
    })
    it('ignores .gitignore', function() {
      checkNotExists(path_1.join(publishedPackagePath, '.gitignore'))
    })
    it('handles "files:" manifest entry correctly', function() {
      checkExists(path_1.join(publishedPackagePath, '.yalc/yalc.txt'))
      checkExists(path_1.join(publishedPackagePath, '.dot/dot.txt'))
      checkExists(path_1.join(publishedPackagePath, 'src'))
      checkExists(path_1.join(publishedPackagePath, 'dist/file.txt'))
      checkExists(path_1.join(publishedPackagePath, 'root-file.txt'))
      checkExists(path_1.join(publishedPackagePath, 'folder/file.txt'))
      checkNotExists(path_1.join(publishedPackagePath, 'folder/file2.txt'))
      checkExists(path_1.join(publishedPackagePath, 'folder2/nested/file.txt'))
      checkNotExists(path_1.join(publishedPackagePath, 'folder2/file.txt'))
      checkNotExists(
        path_1.join(publishedPackagePath, 'folder2/nested/file2.txt')
      )
      checkNotExists(path_1.join(publishedPackagePath, 'test'))
    })
    it('does not respect .npmignore, if package.json "files" present', function() {
      checkExists(
        path_1.join(publishedPackagePath, 'src', 'file-npm-ignored.txt')
      )
    })
    it('it creates signature file', function() {
      var sigFileName = path_1.join(publishedPackagePath, 'yalc.sig')
      checkExists(sigFileName)
      assert_1.ok(fs.statSync(sigFileName).size === 32, 'signature file size')
    })
    it('Adds signature to package.json version', function() {
      var pkg = src_1.readPackageManifest(publishedPackagePath)
      var versionLength =
        values.depPackageVersion.length + shortSignatureLength + 1
      assert_1.ok(pkg.version.length === versionLength)
    })
    it('does not respect .gitignore, if .npmignore presents', function() {})
    describe('signature consistency', function() {
      var expectedSignature
      before(function() {
        expectedSignature = fs
          .readFileSync(path_1.join(publishedPackagePath, 'yalc.sig'))
          .toString()
      })
      beforeEach(function() {
        return src_1.publishPackage({
          workingDir: depPackageDir,
          signature: true
        })
      })
      for (var tries = 1; tries <= 5; tries++) {
        it(
          'should have a consistent signature after every publish (attempt ' +
            tries +
            ')',
          function() {
            var sigFileName = path_1.join(publishedPackagePath, 'yalc.sig')
            var signature = fs.readFileSync(sigFileName).toString()
            assert_1.deepEqual(signature, expectedSignature)
          }
        )
      }
    })
  })
  describe('Package 2 (without `files` in manifest) publish, knit', function() {
    var publishedFilePath = path_1.join(publishedPackage2Path, 'file.txt')
    var originalFilePath = path_1.join(depPackage2Dir, 'file.txt')
    before(function() {
      console.time('Package2 publish')
      return src_1
        .publishPackage({
          workingDir: depPackage2Dir,
          knit: false
        })
        .then(function() {
          console.timeEnd('Package2 publish')
        })
    })
    it('publishes package to store', function() {
      checkExists(publishedFilePath)
      checkExists(path_1.join(publishedPackage2Path, 'package.json'))
    })
    it.skip('publishes symlinks (knitting)', function() {
      assert_1.ok(fs.readlinkSync(publishedFilePath) === originalFilePath)
    })
  })
  describe('Add package', function() {
    before(function() {
      return src_1.addPackages([values.depPackage], {
        workingDir: projectDir
      })
    })
    it('copies package to .yalc folder', function() {
      checkExists(path_1.join(projectDir, '.yalc', values.depPackage))
    })
    it('copies remove package to node_modules', function() {
      checkExists(path_1.join(projectDir, 'node_modules', values.depPackage))
    })
    it('creates to yalc.lock', function() {
      checkExists(path_1.join(projectDir, 'yalc.lock'))
    })
    it('places yalc.lock correct info about file', function() {
      var _a
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      assert_1.deepEqual(
        lockFile.packages,
        ((_a = {}),
        (_a[values.depPackage] = {
          file: true,
          replaced: '1.0.0',
          signature: extractSignature(lockFile, values.depPackage)
        }),
        _a)
      )
    })
    it('updates package.json', function() {
      var _a
      var pkg = src_1.readPackageManifest(projectDir)
      assert_1.deepEqual(
        pkg.dependencies,
        ((_a = {}),
        (_a[values.depPackage] = 'file:.yalc/' + values.depPackage),
        _a)
      )
    })
    it('create and updates installations file', function() {
      var _a
      var installations = installations_1.readInstallationsFile()
      assert_1.deepEqual(
        installations,
        ((_a = {}), (_a[values.depPackage] = [projectDir]), _a)
      )
    })
  })
  describe('Update package', function() {
    var innterNodeModulesFile = path_1.join(
      projectDir,
      'node_modules',
      values.depPackage,
      'node_modules/file.txt'
    )
    before(function() {
      fs.ensureFileSync(innterNodeModulesFile)
      return src_1.updatePackages([values.depPackage], {
        workingDir: projectDir
      })
    })
    it('does not change yalc.lock', function() {
      var _a
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      console.log('lockFile', lockFile)
      assert_1.deepEqual(
        lockFile.packages,
        ((_a = {}),
        (_a[values.depPackage] = {
          file: true,
          replaced: '1.0.0',
          signature: extractSignature(lockFile, values.depPackage)
        }),
        _a)
      )
    })
    it('does not remove inner node_modules', function() {
      checkExists(innterNodeModulesFile)
    })
  })
  describe('Remove not existing package', function() {
    before(function() {
      return src_1.removePackages(['xxxx'], {
        workingDir: projectDir
      })
    })
    it('does not updates yalc.lock', function() {
      var _a
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      assert_1.deepEqual(
        lockFile.packages,
        ((_a = {}),
        (_a[values.depPackage] = {
          file: true,
          replaced: '1.0.0',
          signature: extractSignature(lockFile, values.depPackage)
        }),
        _a)
      )
    })
  })
  describe('Reatreat package', function() {
    before(function() {
      return src_1.removePackages([values.depPackage], {
        workingDir: projectDir,
        retreat: true
      })
    })
    it('does not updates yalc.lock', function() {
      var _a
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      assert_1.deepEqual(
        lockFile.packages,
        ((_a = {}),
        (_a[values.depPackage] = {
          file: true,
          replaced: '1.0.0',
          signature: extractSignature(lockFile, values.depPackage)
        }),
        _a)
      )
    })
    it('updates package.json', function() {
      var _a
      var pkg = src_1.readPackageManifest(projectDir)
      assert_1.deepEqual(
        pkg.dependencies,
        ((_a = {}), (_a[values.depPackage] = values.depPackageVersion), _a)
      )
    })
    it('does not update installations file', function() {
      var _a
      var installtions = installations_1.readInstallationsFile()
      assert_1.deepEqual(
        installtions,
        ((_a = {}), (_a[values.depPackage] = [projectDir]), _a)
      )
    })
    it('should not remove package from .yalc', function() {
      checkExists(path_1.join(projectDir, '.yalc', values.depPackage))
    })
    it('should remove package from node_modules', function() {
      checkNotExists(path_1.join(projectDir, 'node_modules', values.depPackage))
    })
  })
  describe('Update (restore after retreat) package', function() {
    before(function() {
      return src_1.updatePackages([values.depPackage], {
        workingDir: projectDir
      })
    })
    it('updates package.json', function() {
      var _a
      var pkg = src_1.readPackageManifest(projectDir)
      assert_1.deepEqual(
        pkg.dependencies,
        ((_a = {}),
        (_a[values.depPackage] = 'file:.yalc/' + values.depPackage),
        _a)
      )
    })
  })
  describe('Remove package', function() {
    before(function() {
      return src_1.removePackages([values.depPackage], {
        workingDir: projectDir
      })
    })
    it('updates yalc.lock', function() {
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      assert_1.deepEqual(lockFile.packages, {})
    })
    it('updates package.json', function() {
      var _a
      var pkg = src_1.readPackageManifest(projectDir)
      assert_1.deepEqual(
        pkg.dependencies,
        ((_a = {}), (_a[values.depPackage] = values.depPackageVersion), _a)
      )
    })
    it('updates installations file', function() {
      var installtions = installations_1.readInstallationsFile()
      assert_1.deepEqual(installtions, {})
    })
    it('should remove package from .yalc', function() {
      checkNotExists(path_1.join(projectDir, '.ylc', values.depPackage))
    })
    it('should remove package from node_modules', function() {
      checkNotExists(path_1.join(projectDir, 'node_modules', values.depPackage))
    })
  })
  describe('Add package (--link)', function() {
    before(function() {
      return src_1.addPackages([values.depPackage], {
        workingDir: projectDir,
        linkDep: true
      })
    })
    it('copies package to .yalc folder', function() {
      checkExists(path_1.join(projectDir, '.yalc', values.depPackage))
    })
    it('copies remove package to node_modules', function() {
      checkExists(path_1.join(projectDir, 'node_modules', values.depPackage))
    })
    it('creates to yalc.lock', function() {
      checkExists(path_1.join(projectDir, 'yalc.lock'))
    })
    it('places yalc.lock correct info about file', function() {
      var _a
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      assert_1.deepEqual(
        lockFile.packages,
        ((_a = {}),
        (_a[values.depPackage] = {
          link: true,
          replaced: '1.0.0',
          signature: extractSignature(lockFile, values.depPackage)
        }),
        _a)
      )
    })
    it('updates package.json', function() {
      var _a
      var pkg = src_1.readPackageManifest(projectDir)
      assert_1.deepEqual(
        pkg.dependencies,
        ((_a = {}),
        (_a[values.depPackage] = 'link:.yalc/' + values.depPackage),
        _a)
      )
    })
    it('create and updates installations file', function() {
      var _a
      var installtions = installations_1.readInstallationsFile()
      assert_1.deepEqual(
        installtions,
        ((_a = {}), (_a[values.depPackage] = [projectDir]), _a)
      )
    })
  })
  describe('Updated linked (--link) package', function() {
    before(function() {
      return src_1.updatePackages([values.depPackage], {
        workingDir: projectDir
      })
    })
    it('places yalc.lock correct info about file', function() {
      var _a
      var lockFile = lockfile_1.readLockfile({ workingDir: projectDir })
      assert_1.deepEqual(
        lockFile.packages,
        ((_a = {}),
        (_a[values.depPackage] = {
          link: true,
          replaced: '1.0.0',
          signature: extractSignature(lockFile, values.depPackage)
        }),
        _a)
      )
    })
    it('updates package.json', function() {
      var _a
      var pkg = src_1.readPackageManifest(projectDir)
      assert_1.deepEqual(
        pkg.dependencies,
        ((_a = {}),
        (_a[values.depPackage] = 'link:.yalc/' + values.depPackage),
        _a)
      )
    })
    it('create and updates installations file', function() {
      var _a
      var installtions = installations_1.readInstallationsFile()
      assert_1.deepEqual(
        installtions,
        ((_a = {}), (_a[values.depPackage] = [projectDir]), _a)
      )
    })
  })
})
//# sourceMappingURL=index.js.map
