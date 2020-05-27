import { existsSync } from 'fs'

import { getTestFiles, launch } from 'aria-mocha'
import { ServerConfig } from 'vite'
import { Options } from './options'

const createUrl = ({ port, hostname, path }) => `http://${hostname}:${port}/${path}`

export function serverConfigPlugin(options: Options) {
  const { dir, script, path, html } = options

  const Router = require('koa-router')
  const send = require('koa-send')
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
      if (ctx.path.includes(`/${path}`)) return send(ctx, html)
      return next()
    })
  
    app.use(router.routes())
  }
}

export async function startServer(options: Options, config?: ServerConfig) {
  const { port, headless } = options

  const path = options.path ? options.path.substr(1, options.path.length): 'tests'
  const hostname = 'localhost'
  const html = options.html ?? '/node_modules/aria-vue/index.html'

  const configureServer = [
    ...(config?.configureServer 
          ? Array.isArray(config?.configureServer)
              ? config?.configureServer: [ config?.configureServer ]
          : []),
     serverConfigPlugin({ ...options, html })
  ]
  
  const { createServer } = await import('vite')
  const server = createServer({ ...(config ?? {}), port, configureServer })
  server.listen(port, hostname)

  if (headless) {
    await launch(createUrl({ hostname, port, path: html.substr(1, html.length) }))
    process.exit()
  } else {
    console.log(`Go to ${createUrl({ hostname, port, path })} \nto see test result(s).`)
  }
}