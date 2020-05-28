import { existsSync } from 'fs'
import { normalize } from 'path'

import { getTestFiles, launch, isGlob, globFiles } from 'aria-mocha'
import { ServerConfig } from 'vite'

import { Options } from './options'

const createUrl = ({ port, hostname, path }) => `http://${hostname}:${port}/${path}`

function normalizeOptions(options: Options) {
  const removeBacklash = (str: string) => {
    const paths = normalize(str).split('/')
    return (paths.length > 1) ? paths.splice(1).join('/'): paths.shift()
  }
  const { 
    script,
    headless,
    watch,
    port = 3000,
    dir = removeBacklash('test'), 
    path = removeBacklash('tests'), 
    html = removeBacklash('/node_modules/aria-vue/index.html')
  } = options

  return { script, watch, headless, port, dir, path, html }
}

export function testPlugin(options: Options) {
  const { script, dir, path, html } = normalizeOptions(options)

  const Router = require('koa-router')
  const router = new Router()

  return ({ app }) => {
    router.get('/test-files', async (ctx, next) => {
      ctx.body = await getTestFiles(`${dir}/**/*.spec.js`, true)
      return next()
    })

    router.get('/init', async(ctx, next) => {
      ctx.body = existsSync(script) ? [ script ]: []
      return next()  
    })

    app.use(async (ctx, next) => {
      if (ctx.path.includes(`/${path}`)) return require('koa-send')(ctx, html)
      return next()
    })
  
    app.use(router.routes())
  }
}

export function watchPlugin(files?: string | string[]) {
  return async ({ watcher, resolver }) => {
    const watchFiles = files ? Array.isArray(files) ? files: [ files ]: []
    const substr = (str: string) => str.substr(1, str.length)
    
    const globs = await Promise.all(watchFiles.map(async file => {
     const files = isGlob(file) ? await globFiles(file, true): [ file ]
      return files.map(str => substr(str))
    }))
    /// @ts-ignore
    const flatFiles = globs.flat()

    watcher.on('change', async (file: string) => {
      const path = resolver.fileToRequest(file)
      flatFiles.includes(path)
        && watcher.send({
            type: 'full-reload',
            path,
            timestamp: Date.now()
          })
    })
  }
}

export async function startServer(options: Options, config?: ServerConfig) {
  const { port, headless, path, watch, html } = normalizeOptions(options)

  const hostname = 'localhost'
  const configureServer = [
    ...(config?.configureServer 
          ? Array.isArray(config?.configureServer)
              ? config?.configureServer: [ config?.configureServer ]
          : []),
    testPlugin({ ...options, html }),
    (watch && !headless) 
        && watchPlugin([ 
            './src/**/*.vue', 
            './src/**/*.spec.js',
            './test/**/*.spec.js'
          ])
  ]
  
  const { createServer } = await import('vite')
  const server = createServer({ ...(config ?? {}), port, configureServer })
  server.listen(port, hostname)

  if (headless) {
    await launch(createUrl({ hostname, port, path: html }))
    process.exit()
  } else {
    console.log(`Go to ${createUrl({ hostname, port, path })}`)
  }
}