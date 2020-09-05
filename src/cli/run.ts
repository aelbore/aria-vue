import { startServer } from './server'
import { Options } from '../common/options'
import { existsSync } from 'fs'

import sade from 'sade'
import { patchBabelParser } from '../optimize'

export async function run({ version, name }) {
  const prog = sade(name, true)
  prog
    .version(version)
    .option('-p, --port', 'port to use default(3000)', 3000)
    .option('-d --dir', 'root directory of test files default (test folder)', 'test')
    .option('-w --watch', 'enable watch', false)
    .option('-H --headless', 'run test(s) in headless', false)
    .option('--script', 'scripts or helper scripts to load before setup')
    .option('--path', 'virtual path for your html reporter')
    .option('--html', 'path of your index.html file')
    .example('--headless --script ./test/plugin.js')
    .example('--watch --path my-virtual-path --script ./test/plugin.js')
    .example('--path test-ui --html ./test/index.html --script ./test/plugins.js')
    .action(handler)
    .parse(process.argv)
}

export async function handler(options: Options) {
  if (!(existsSync('./node_modules/@babel/parser/index.js'))) {
    await patchBabelParser()
  }
  await startServer(options)
}