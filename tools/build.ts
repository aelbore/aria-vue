import { bundle, clean, TSRollupConfig, copy } from 'aria-build'
import { builtinModules } from 'module'

(async function() {
  const pkg = require('../package.json')

  const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.devDependencies),
    ...builtinModules
  ]

  const config: TSRollupConfig[] = [
    {
      input: './src/setup.ts',
      external,
      plugins: [ 
        copy({
          targets: [
            { src: './src/*.html', dest: 'dist' }
          ]
        }) 
      ],
      output: {
        file: './dist/setup.js',
        format: 'es'
      }
    },
    {
      input: './src/server.ts',
      external,
      output: [
        {
          file: './dist/aria-vue.js',
          format: 'cjs'
        },
        {
          file: './dist/aria-vue.es.js',
          format: 'es'
        }
      ],
      tsconfig: {
        compilerOptions: {
          declaration: true
        }
      }
    }
  ]

  await clean('dist')
  await bundle({ config, esbuild: true, write: true })
})()