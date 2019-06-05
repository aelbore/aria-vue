import { bundle, clean } from 'aria-build'

(async function() {
  const options = await import('./config').then(config => config.default)

  await clean('dist')
  await bundle(options)
})()