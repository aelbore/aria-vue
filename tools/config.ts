import { getPackageJson } from 'aria-build'

const pkg = getPackageJson()
const external = Object.keys(pkg.dependencies)

export default [
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