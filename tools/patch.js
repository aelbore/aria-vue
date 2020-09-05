(async function() {
  const { rollup } = require('rollup')
  const { join } = require('path')
  
  const resolve = require('@rollup/plugin-node-resolve')
  const commonjs = require('@rollup/plugin-commonjs')

  async function patchBabelParser() {
    const bundle = await rollup({
      input: join(__dirname, 'babel-parser.js'),
      plugins: [commonjs(), resolve.default()]
    });
    await bundle.write({
      file: "./node_modules/@babel/parser/index.js",
      format: "es",
      sourcemap: true
    })
  }

  await patchBabelParser()
})()
