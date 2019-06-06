import { bundle, clean } from 'aria-build'

(async function() {
  const options = await import('./config')

  await clean('dist')
  await bundle(options.default)
})()