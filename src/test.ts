import { TestAriaConfigOptions } from 'aria-build'
import { getPlugins } from './options'

const plugins = getPlugins()

export function test() {
  const opts: TestAriaConfigOptions = {
    plugins,
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