import { bundle, clean, TSRollupConfig, copy, replaceContent } from 'aria-build'
import { builtinModules } from 'module'

(async function() {
  const pkg = require('../package.json')

  const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.devDependencies),
    ...builtinModules
  ]

  function replace(filename: string) {
    return replaceContent({ filename, strToFind: '../src',  strToReplace: '../aria-vue' })
  }

  const config: TSRollupConfig[] = [
    {
      input: './src/setup.ts',
      external,
      plugins: [ 
        copy({
          targets: [
            { src: './src/*.html', dest: 'dist' },
            { src: 'bin/*', dest: 'dist/bin', replace }
          ]
        })
      ],
      output: {
        file: './dist/setup.js',
        format: 'es'
      }
    },
    {
      input: './src/run.ts',
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