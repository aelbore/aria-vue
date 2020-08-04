import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import { rollup } from 'rollup'
import { existsSync } from 'fs'

export async function patchBabelParser() {
  const bundle = await rollup({
    input: './node_modules/aria-vue/tools/babel-parser.js',
    plugins: [ commonjs(), resolve() ]
  })

  await bundle.write({ 
    file: './node_modules/@babel/parser/index.js',
    format: 'es',
    sourcemap: true
  })
}

export function patchConfig() {
  const config: import('vite').UserConfig = {
    ...(existsSync('./node_modules/@babel/parser/index.js') 
      ? {
          alias: {
            '@babel/parser': '@babel/parser/index'
          }
        }
      :{})
  }

  return config
}