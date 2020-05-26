
import { startServer } from './server'

export interface CliOptions {
  port?: number
  script?: string
  root?: string
}

export async function run({ version, name }) {
  const prog = require('sade')(name, true)
  prog
    .version(version)
    .option('-p, --port', 'port to use default(3000)', 3000)
    .option('--script', 'scripts or helper scripts to load before setup')
    .option('--root', 'root directory of test files default (test folder)', 'test')
    .action(handler)
    .parse(process.argv)
}

export async function handler(options: CliOptions) {
  const { port, script, root } = options
  await startServer({ port, script, root })
}