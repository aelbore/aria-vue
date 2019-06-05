import * as path from 'path'
import { createKarmaConfig, KarmaOptions } from 'aria-test'
import { alias } from 'aria-build'

const vue = require('rollup-plugin-vue')
const paths = [ 'node_modules', 'vue', 'dist', 'vue.js' ]

export default function vueKarmaConfig(options?: KarmaOptions) {
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