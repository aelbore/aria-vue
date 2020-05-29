import * as crypto from 'crypto'

import { basename } from 'path'
import { readFileSync } from 'fs'
import { isGlob, globFiles, launch } from 'aria-mocha'

import { WatchOptions, createUrl, normalizeOptions } from '../common/common'

const contentHash = (str: Buffer) => 
  crypto
    .createHash('md5')
    .update(str.toString(), 'utf8')
    .digest('hex')

const getContentHash = (src: string) => contentHash(readFileSync(`.${src}`))

const getfileStore = async (files: string | string[]) => {
  const fileStore = new Map()
  const watchFiles = Array.isArray(files) ? files: [ files ]
  const substr = (str: string) => str.substr(1, str.length)

  const globs = await Promise.all(watchFiles.map(async file => {
    const files = isGlob(file) ? await globFiles(file, true): [ file ]
    return files.map(str => substr(str))
  }))

  /// @ts-ignore
  const flatFiles: string[] = globs.flat()
  await Promise.all(flatFiles.map(file => {
    fileStore.set(file, getContentHash(file))
  }))

  const compare = (file: string) => {
    const current = getContentHash(file)
    return (current !== fileStore.get(file)) ? current: null
  }

  const set = (file: string, content: string) => 
    fileStore.set(file, content)

  return { compare, set }
} 

export function watchPlugin(options: WatchOptions = {}) {
  const { port, path, hostname, headless } = normalizeOptions(options)
  const {  
    files = [
      './src/**/*.vue', 
      './src/**/*.spec.js',
      './test/**/*.spec.js'
    ] 
  } = options 

  return async ({ watcher, resolver }) => {
    const fileStore = await getfileStore(files)
    let fsWait = false

    watcher.on('change', async (file: string) => {
      if (fsWait) return

      /// @ts-ignore
      fsWait = setTimeout(() => fsWait = false, 100)

      const pathFile = resolver.fileToRequest(file)
      const content = fileStore.compare(pathFile)

      if (content) {
        fileStore.set(pathFile, content)

        watcher.send({ 
          type: 'full-reload',
          path: pathFile,
          timestamp: Date.now()
        })
          
        headless 
          && await launch(createUrl({ 
              port,
              hostname, 
              path: pathFile.includes('.spec.js') 
                ? `${path}?spec=${basename(pathFile)}`
                : path
            }))
      }
    })
  }
}