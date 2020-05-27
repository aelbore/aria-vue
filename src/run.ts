
import { startServer } from './server'

export interface CliOptions {
  port?: number
  script?: string
  dir?: string
  headless?: boolean
}

export async function run({ version, name }) {
  const prog = require('sade')(name, true)
  prog
    .version(version)
    .option('-p, --port', 'port to use default(3000)', 3000)
    .option('-d --dir', 'root directory of test files default (test folder)', 'test')
    .option('--headless', 'run test(s) in headless', false)
    .option('--script', 'scripts or helper scripts to load before setup')
    .action(handler)
    .parse(process.argv)
}

export async function handler(options: CliOptions) {
  const { port, script, dir, headless } = options
  await startServer({ port, script, dir, headless })
}