import { getTestFiles, launch } from 'aria-mocha'

export interface ServerOptions {
  port?: number
  hostname?: string
  testRootFolder?: string
}

async function serverConfigPlugin(root: string) {
  const Router = require('koa-router')
  const router = new Router()

  return ({ app }) => {
    router.get('/test-files', async (ctx, next) => {
      ctx.body = await getTestFiles(`${root}/**/*.spec.js`, true)
      return next()
    })
  
    app.use(router.routes())
  }
}

export async function startServer(options: ServerOptions = {
  port: 3000,
  hostname: 'localhost',
  testRootFolder: 'test'
}) {
  const { port, hostname, testRootFolder } = options
  const { createServer } = await import('vite')
  const configureServer = await serverConfigPlugin(testRootFolder) 

  const server = createServer({ 
    configureServer, 
    optimizeDeps: {
      exclude: [ 'koa-router' ]
    }
  })

  server.listen(options.port, options.port, async () => {
    await launch(`http://${hostname}:${port}/${testRootFolder}/index.html`)
    process.exit()
  })
}