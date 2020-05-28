import { existsSync } from 'fs'
import { getTestFiles } from 'aria-mocha'

import { Options } from '../options'
import { normalizeOptions } from '../common'

export function testPlugin(options: Options) {
  const { script, dir, path, html } = normalizeOptions(options)

  const Router = require('koa-router')
  const router = new Router()

  return ({ app }) => {
    router.get('/test-files', async (ctx, next) => {
      ctx.body = await getTestFiles(`${dir}/**/*.spec.js`, true)
      return next()
    })

    router.get('/init', async(ctx, next) => {
      ctx.body = existsSync(script) ? [ script ]: []
      return next()  
    })

    app.use(async (ctx, next) => {
      if (ctx.path.includes(`/${path}`)) return require('koa-send')(ctx, html)
      return next()
    })
  
    app.use(router.routes())
  }
}
