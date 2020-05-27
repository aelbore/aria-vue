
import { startServer } from './server'
import { Options } from './options'

export async function run({ version, name }) {
  const prog = require('sade')(name, true)
  prog
    .version(version)
    .option('-p, --port', 'port to use default(3000)', 3000)
    .option('-d --dir', 'root directory of test files default (test folder)', 'test')
    .option('--headless', 'run test(s) in headless', false)
    .option('--script', 'scripts or helper scripts to load before setup')
    .option('--path', 'virtual path for your html reporter')
    .example('--headless --script ./test/plugin.js')
    .example('--path my-virtual-path --script ./test/plugin.js')
    .action(handler)
    .parse(process.argv)
}

export async function handler(options: Options) {
  const { port, script, dir, headless } = options
  await startServer(options)
}