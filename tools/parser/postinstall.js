(async function() {
  const resolve = require('@rollup/plugin-node-resolve').default
  const commonjs = require('@rollup/plugin-commonjs')

  const { rollup } =  require('rollup')

  const bundle = await rollup({
    input: './tools/parser/babel-parser.js',
    plugins: [ commonjs(), resolve() ]
  })

  await bundle.write({ 
    file: './node_modules/@babel/parser/index.js',
    format: 'es',
    sourcemap: true
  })
})()