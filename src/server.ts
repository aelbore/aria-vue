import { normalize } from 'path'
import { existsSync } from 'fs'

import { getTestFiles, launch } from 'aria-mocha'
import { ServerConfig } from 'vite'

export interface ServerOptions extends ServerConfig {
  root?: string
  script?: string
}

async function serverConfigPlugin(options: ServerOptions) {
  const { root, script } = options

  const Router = require('koa-router')
  const router = new Router()

  return ({ app }) => {
    router.get('/test-files', async (ctx, next) => {
      ctx.body = await getTestFiles(`${root}/**/*.spec.js`, true)
      return next()
    })

    router.get('/init', async(ctx, next) => {
      ctx.body = existsSync(script) ? [ script ]: []
      return next()  
    })
  
    app.use(router.routes())
  }
}

export async function startServer(options: ServerOptions) {
  const { port = 3000, root = 'test', script } = (options ?? {})

  const hostname = 'localhost'
  const defaultHtmlPath = 'node_modules/aria-vue/index.html'

  const { createServer } = await import('vite')
  const configureServer = [
    ...(options.configureServer 
          ? Array.isArray(options.configureServer)
              ? options.configureServer: [ options.configureServer ]
          : []),
     await serverConfigPlugin({ script, root })
  ]
  
  const server = createServer({ ...options, configureServer })
  server.listen(port, hostname)

  await launch(`http://${hostname}:${port}/${normalize(defaultHtmlPath)}`)
  process.exit()
}