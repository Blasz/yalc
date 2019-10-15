export interface PublishPackageOptions {
  workingDir: string
  signature?: boolean
  knit?: boolean
  force?: boolean
  changed?: boolean
  push?: boolean
  pushSafe?: boolean
  yarn?: boolean
  npm?: boolean
  files?: boolean
  private?: boolean
}
export declare const publishPackage: (
  options: PublishPackageOptions
) => Promise<void>
