import { TestAriaConfigOptions, createTSRollupConfig } from 'aria-build'
import { vue } from './libs'

export function test() {
  const opts: TestAriaConfigOptions = {
    plugins: [ vue() ],
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