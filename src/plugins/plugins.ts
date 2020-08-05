import { UserConfig } from 'vite'
import { normalizeOptions, Options } from '../common/common'

import { testPlugin } from './test-plugin'
import { watchPlugin } from './watch-plugin'

export function createVueTestPlugin(options?: Options) {
  const opts = normalizeOptions(options)

  const config: UserConfig = {
    configureServer: [
      testPlugin(opts),
      ...(opts.watch ? [ watchPlugin(opts) ]: [])
    ],
    optimizeDeps: {
      /// https://github.com/vitejs/vite/issues/669
      include: [ '@vue/test-utils' ]
    }
  }

  return config
}