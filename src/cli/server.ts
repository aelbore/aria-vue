import { launch } from 'aria-mocha'

import { Options } from '../common/options'
import { normalizeOptions, createUrl } from '../common/common'
import { createVueTestPlugin } from '../plugins/plugins'

async function launchHeadless({ hostname, port, path, watch }) {
  await launch(createUrl({ hostname, port, path }))
  ;(!watch && process.exit())
}

export async function startServer(options: Options) {
  const opts = normalizeOptions(options)
  
  const { createServer } = await import('vite')

  const vueTestPlugin = createVueTestPlugin(opts)
  const server = createServer(vueTestPlugin)

  const { port, headless, hostname, html } = opts
  server.listen(port, hostname, async () => {
    headless 
      ? await launchHeadless({ ...opts, path: html }) 
      : console.log(`Go to ${createUrl(opts)}`)
  })
}