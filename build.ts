import { bundle, clean, TSRollupConfig } from 'aria-build'

(async function() {
  const pkg = require('./package.json')
  const external = Object.keys(pkg.dependencies)

  const options: TSRollupConfig[] = [
    {
      input: './src/index.ts',
      external,
      output: {
        format: 'es',
        file: './dist/aria-vue.es.js'
      },
      tsconfig: {
        compilerOptions: {
          declaration: true
        }
      }
    },
    {
      input: './src/index.ts',
      external,
      output: {
        format: 'cjs',
        file: './dist/aria-vue.js'
      }
    }
  ]

  await clean('dist')
  await bundle(options)
})()