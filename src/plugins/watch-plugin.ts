import { basename } from 'path'
import { isGlob, globFiles, launch } from 'aria-mocha'

import { WatchOptions } from '../options'
import { createUrl, normalizeOptions } from '../common'

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
    const watchFiles = Array.isArray(files) ? files: [ files ]
    const substr = (str: string) => str.substr(1, str.length)
    
    const globs = await Promise.all(watchFiles.map(async file => {
     const files = isGlob(file) ? await globFiles(file, true): [ file ]
      return files.map(str => substr(str))
    }))
    /// @ts-ignore
    const flatFiles: string[] = globs.flat()

    watcher.on('change', async (file: string) => {
      const pathFile: string = resolver.fileToRequest(file)
      const isInclude = flatFiles.includes(pathFile) 
      
      isInclude 
        && watcher.send({
            type: 'full-reload',
            path: pathFile,
            timestamp: Date.now()
          })
      
      isInclude
        && headless 
        && await launch(createUrl({ 
            port,
            hostname, 
            path: pathFile.includes('.spec.js') 
              ? `${path}?spec=${basename(pathFile)}`
              : path
            }))
    })
  }
}