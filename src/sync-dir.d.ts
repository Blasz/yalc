/// <reference types="node" />
import * as fs from 'fs-extra'
declare type Cache = {
  [dir: string]: {
    glob: string[]
    files: {
      [file: string]: {
        stat: fs.Stats
        hash: string
      }
    }
  }
}
export declare const copyDirSafe: (
  srcDir: string,
  destDir: string,
  cache?: Cache
) => Promise<void>
export {}
