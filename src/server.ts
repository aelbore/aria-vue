import { normalize } from 'path'
import { existsSync } from 'fs'

import { getTestFiles, launch } from 'aria-mocha'
import { ServerConfig } from 'vite'

export interface ServerOptions extends ServerConfig {
  dir?: string
  script?: string
  headless?: boolean
  html?: string
}

async function serverConfigPlugin(options: ServerOptions) {
  const { dir, script } = options

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
  
    app.use(router.routes())
  }
}

async function launchHeadless({ port, hostname, html }) {
  await launch(`http://${hostname}:${port}/${normalize(html)}`)
  process.exit()
}

export async function startServer(options: ServerOptions = {}) {
  const opts = { ...options }
  delete opts.dir
  delete opts.script

  const hostname = 'localhost'
  const html = options.html ?? '/node_modules/aria-vue/index.html'

  const { createServer } = await import('vite')

  const configureServer = [
    ...(options.configureServer 
          ? Array.isArray(options.configureServer)
              ? options.configureServer: [ options.configureServer ]
          : []),
     await serverConfigPlugin(options)
  ]
  
  const server = createServer({ ...opts, configureServer })
  server.listen(opts.port, hostname)

  !options.headless 
    && console.log(`
      Go to http://${hostname}:${opts.port}/tests
      to see test result(s).
    `)

  options.headless 
    && await launchHeadless({ hostname, port: opts.port, html })
}