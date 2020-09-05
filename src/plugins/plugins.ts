import { existsSync } from 'fs'
import { UserConfig } from 'vite'
import { normalizeOptions, Options } from '../common/common'

import { testPlugin } from './test-plugin'
import { watchPlugin } from './watch-plugin'

function patchConfig() {
  const config = {
    ...existsSync("./node_modules/@babel/parser/index.js") ? {
      alias: {
        "@babel/parser": "@babel/parser/index"
      }
    } : {}
  };
  return config;
}

export function createVueTestPlugin(options?: Options) {
  const opts = normalizeOptions(options)

  const config: UserConfig = {
    ...patchConfig(),
    configureServer: [
      testPlugin(opts),
      ...(opts.watch ? [ watchPlugin(opts) ]: [])
    ]
  }

  return config
}