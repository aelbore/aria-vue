import { TSRollupConfig, rollupBuild, createTSRollupConfig, replacePlugin } from 'aria-build'
import { getPlugins } from './options'

export function build(options: TSRollupConfig | Array<TSRollupConfig>) {
  const configs = Array.isArray(options) ? options: [ options ]
  return Promise.all(configs.map(config => {
    const opts = createTSRollupConfig(config)
    opts.inputOptions.plugins = [ 
      ...opts.inputOptions.plugins, ...getPlugins() 
    ]
    return rollupBuild(opts)
  }))
}