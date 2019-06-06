import * as path from 'path'

import { KarmaOptions, createKarmaConfig } from 'aria-test'
import { alias } from 'aria-build'

const vue = require('rollup-plugin-vue')
const paths = [ 'node_modules', 'vue', 'dist', 'vue.js' ]

export { vue }

export function createVueKarmaConfig(options?: KarmaOptions) {
  return createKarmaConfig({ 
    frameworks: ['mocha', 'chai'],
    rollup: {
      custom: true,
      plugins: [
        alias({ vue: path.join(...paths) }),
        vue()
      ]
    },
    ...(options || {})
  })
}