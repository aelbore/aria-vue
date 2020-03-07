import { TSRollupConfig, rollupBuild, createTSRollupConfig, replacePlugin } from 'aria-build'

const vue = require('rollup-plugin-vue')

export { vue }

export function build(options: TSRollupConfig | Array<TSRollupConfig>) {
  const configs = Array.isArray(options) ? options: [ options ]
  return Promise.all(configs.map(config => {
    const opts = createTSRollupConfig(config)
    opts.inputOptions.plugins = [
      ...opts.inputOptions.plugins,
      vue(),
      replacePlugin({ ...(config.replace ?? {}) })
    ]
    return rollupBuild(opts)
  }))
}