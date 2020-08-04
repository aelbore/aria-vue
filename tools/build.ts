import { bundle, clean, TSRollupConfig, copy, writeFile, replaceContent, symlinkDir } from 'aria-build'
import { builtinModules } from 'module'

(async function() {
  const pkg = require('../package.json')
  const postinstall = pkg.scripts.postinstall

  const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.devDependencies),
    ...builtinModules
  ]

  async function addPostInstall() {
    const json = require('../dist/package.json')
    json.scripts = { postinstall }
    await writeFile('./dist/package.json', JSON.stringify(json, null, 2))
  }

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
            { src: 'bin/*', dest: 'dist/bin', replace },
            { src: './tools/parser/*', dest: './dist/tools/parser' }
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