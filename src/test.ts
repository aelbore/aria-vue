import { TestAriaConfigOptions, replacePlugin } from 'aria-build'
import { vue } from './libs'

import json from '@rollup/plugin-json'

export function test(config?: TestAriaConfigOptions) {
  const opts: TestAriaConfigOptions = {
    plugins: [ 
      vue(),
      json(),
      replacePlugin({ 
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.VUE_ENV': JSON.stringify('browser')
      })
    ],
    output: {
      globals: {
        'vue': 'Vue',
        '@vue/test-utils': 'VueTestUtils'
      }
    },
    scripts: [
      './node_modules/vue/dist/vue.js',
      './node_modules/vue-template-compiler/browser.js',
      './node_modules/@vue/test-utils/dist/vue-test-utils.iife.js'
    ]
  }  
  return opts
}