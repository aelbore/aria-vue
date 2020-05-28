import { launch } from 'aria-mocha'
import { ServerConfig } from 'vite'

import { Options } from './options'
import { normalizeOptions, createUrl } from './common'
import { testPlugin, watchPlugin } from './plugins/plugins'

async function launchHeadless({ hostname, port, path, watch }) {
  await launch(createUrl({ hostname, port, path }))
  !watch && process.exit()
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
    watch && watchPlugin({ port, headless, path, hostname })
  ]
  
  const { createServer } = await import('vite')
  const server = createServer({ ...(config ?? {}), port, configureServer })

  server.listen(port, hostname, async () => {
    headless 
      && await launchHeadless({ hostname, port, path: html, watch }) 
    !headless 
      && console.log(`Go to ${createUrl({ hostname, port, path })}`)  
  })
}