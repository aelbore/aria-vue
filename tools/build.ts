import { bundle, clean, TSRollupConfig, copy, replaceContent, symlinkDir, writeFile } from 'aria-build'
import { builtinModules } from 'module'

(async function() {
  const pkg = require('../package.json')

  async function addPostInstall() {
    const json = require('../dist/package.json')
    json.scripts = {  
      "prepare": "node ./node_modules/aria-vue/tools/patch.js"
    }
    await writeFile('./dist/package.json', JSON.stringify(json, null, 2))
  }

  const external = [
    'sade',
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.devDependencies),
    ...builtinModules,
    'rollup',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-commonjs'
  ]

  function replace(filename: string) {
    return replaceContent({ 
      filename, 
      strToFind: '../src',  
      strToReplace: '../aria-vue' 
    })
  }

  const config: TSRollupConfig[] = [
    {
      input: './src/setup.ts',
      external,
      plugins: [ 
        copy({
          targets: [
            { src: './src/*.html', dest: 'dist' },
            { src: 'bin/*', dest: 'dist/bin', replace },
            { src: './tools/*.js', dest: './dist/tools' }
          ]
        })
      ],
      output: {
        file: './dist/setup.js',
        format: 'es'
      }
    },
    {
      input: './src/index.ts',
      external,
      output: [
        { file: './dist/aria-vue.js', format: 'cjs' },
        { file: './dist/aria-vue.es.js', format: 'es' }
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
  await addPostInstall()
  await Promise.all([
    symlinkDir('./node_modules', './example/node_modules'),
    symlinkDir('./dist', './node_modules/aria-vue')
  ])
})()