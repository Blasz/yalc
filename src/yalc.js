#!/usr/bin/env node
'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this
        }),
      g
    )
    function verb(n) {
      return function(v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var _this = this
Object.defineProperty(exports, '__esModule', { value: true })
var yargs = require('yargs')
var path_1 = require('path')
var _1 = require('.')
var installations_1 = require('./installations')
var check_1 = require('./check')
var publishFlags = ['knit', 'force', 'sig', 'changed', 'yarn', 'files']
var cliCommand = _1.values.myNameIs
var getVersionMessage = function() {
  var pkg = require(__dirname + '/../package.json')
  return pkg.version
}
/* tslint:disable-next-line */
yargs
  .usage(cliCommand + ' [command] [options] [package1 [package2...]]')
  .coerce('store-folder', function(folder) {
    if (!_1.yalcGlobal.yalcStoreMainDir) {
      _1.yalcGlobal.yalcStoreMainDir = path_1.resolve(folder)
      console.log('Package store folder used:', _1.yalcGlobal.yalcStoreMainDir)
    }
  })
  .command({
    command: '*',
    builder: function() {
      return yargs.boolean(['version'])
    },
    handler: function(argv) {
      var msg = 'Use `yalc help` to see available commands.'
      if (argv._[0]) {
        msg = 'Unknown command `' + argv._[0] + '`. ' + msg
      } else {
        if (argv.version) {
          msg = getVersionMessage()
        }
      }
      console.log(msg)
    }
  })
  .command({
    command: 'publish',
    describe: 'Publish package in yalc local repo',
    builder: function() {
      return yargs
        .default('sig', true)
        .boolean(['push', 'push-safe'].concat(publishFlags))
    },
    handler: function(argv) {
      var folder = argv._[1]
      return _1.publishPackage({
        workingDir: path_1.join(process.cwd(), folder || ''),
        push: argv.push,
        pushSafe: argv.pushSafe,
        force: argv.force,
        knit: argv.knit,
        signature: argv.sig,
        yarn: argv.yarn || argv.npm,
        changed: argv.changed,
        files: argv.files,
        private: argv.private
      })
    }
  })
  .command({
    command: 'installations',
    describe: 'Work with installations file: show/clean',
    builder: function() {
      return yargs.boolean(['dry'])
    },
    handler: function(argv) {
      return __awaiter(_this, void 0, void 0, function() {
        var action, packages, _a
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              action = argv._[1]
              packages = argv._.slice(2)
              _a = action
              switch (_a) {
                case 'show':
                  return [3 /*break*/, 1]
                case 'clean':
                  return [3 /*break*/, 2]
              }
              return [3 /*break*/, 4]
            case 1:
              installations_1.showInstallations({ packages: packages })
              return [3 /*break*/, 5]
            case 2:
              return [
                4 /*yield*/,
                installations_1.cleanInstallations({
                  packages: packages,
                  dry: argv.dry
                })
              ]
            case 3:
              _b.sent()
              return [3 /*break*/, 5]
            case 4:
              console.log('Need installation action: show | clean')
              _b.label = 5
            case 5:
              return [2 /*return*/]
          }
        })
      })
    }
  })
  .command({
    command: 'push',
    describe:
      'Publish package in yalc local repo and push to all installations',
    builder: function() {
      return yargs
        .default('force', undefined)
        .default('sig', true)
        .boolean(['safe'].concat(publishFlags))
    },
    handler: function(argv) {
      return _1.publishPackage({
        workingDir: path_1.join(process.cwd(), argv._[1] || ''),
        force: argv.force !== undefined ? argv.force : true,
        knit: argv.knit,
        push: true,
        pushSafe: argv.safe,
        signature: argv.sig,
        yarn: argv.yarn || argv.npm,
        changed: argv.changed,
        files: argv.files,
        private: argv.private
      })
    }
  })
  .command({
    command: 'add',
    describe: 'Add package from yalc repo to the project',
    builder: function() {
      return yargs
        .boolean(['file', 'dev', 'link', 'yarn', 'pure'])
        .alias('D', 'dev')
        .alias('save-dev', 'dev')
        .help(true)
    },
    handler: function(argv) {
      var hasPureArg = process.argv.reduce(function(res, arg) {
        return res || /-pure/.test(arg)
      }, false)
      return _1.addPackages(argv._.slice(1), {
        dev: argv.dev,
        yarn: argv.yarn || argv.npm,
        linkDep: argv.link,
        pure: hasPureArg ? argv.pure : undefined,
        workingDir: process.cwd()
      })
    }
  })
  .command({
    command: 'link',
    describe: 'Link package from yalc repo to the project',
    builder: function() {
      return yargs.help(true)
    },
    handler: function(argv) {
      return _1.addPackages(argv._.slice(1), {
        link: true,
        yarn: argv.yarn || argv.npm,
        workingDir: process.cwd()
      })
    }
  })
  .command({
    command: 'update',
    describe: 'Update packages from yalc repo',
    builder: function() {
      return yargs.help(true)
    },
    handler: function(argv) {
      return _1.updatePackages(argv._.slice(1), {
        workingDir: process.cwd()
      })
    }
  })
  .command({
    command: 'remove',
    describe: 'Remove packages from the project',
    builder: function() {
      return yargs.boolean(['retreat', 'all']).help(true)
    },
    handler: function(argv) {
      return _1.removePackages(argv._.slice(1), {
        retreat: argv.retreat,
        workingDir: process.cwd(),
        all: argv.all
      })
    }
  })
  .command({
    command: 'retreat',
    describe:
      'Remove packages from project, but leave in lock file (to be restored later)',
    builder: function() {
      return yargs.boolean(['all']).help(true)
    },
    handler: function(argv) {
      return _1.removePackages(argv._.slice(1), {
        all: argv.all,
        retreat: true,
        workingDir: process.cwd()
      })
    }
  })
  .command({
    command: 'check',
    describe: 'Check package.json for yalc packages',
    builder: function() {
      return yargs
        .boolean(['commit'])
        .usage('check usage here')
        .help(true)
    },
    handler: function(argv) {
      var gitParams = process.env.GIT_PARAMS
      if (argv.commit) {
        console.log('gitParams', gitParams)
      }
      check_1.checkManifest({
        commit: argv.commit,
        all: argv.all,
        workingDir: process.cwd()
      })
    }
  })
  .command({
    command: 'dir',
    describe: 'Show yalc system directory',
    handler: function() {
      console.log(_1.getStoreMainDir())
    }
  })
  .help('help').argv
//# sourceMappingURL=yalc.js.map
