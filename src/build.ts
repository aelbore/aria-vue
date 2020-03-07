import { TSRollupConfig, rollupBuild, createTSRollupConfig, replacePlugin } from 'aria-build'
import { vue } from './libs'

export function build(options: TSRollupConfig | Array<TSRollupConfig>) {
  const configs = Array.isArray(options) ? options: [ options ]
  return Promise.all(configs.map(config => {
    const opts = createTSRollupConfig(config)
    opts.inputOptions.plugins = [
      ...opts.inputOptions.plugins,
      vue(),
      replacePlugin({ 
        'process.env.NODE_ENV': JSON.stringify('development'),
        ...(config.replace ?? {}) 
      })
    ]
    return rollupBuild(opts)
  }))
}