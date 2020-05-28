import { existsSync } from 'fs'
import { getTestFiles } from 'aria-mocha'
import { Context, Next } from 'koa'

import { Options, normalizeOptions } from '../common/common'

export function testPlugin(options: Options) {
  const { script, dir, path, html } = normalizeOptions(options)

  const Router = require('koa-router')
  const router = new Router()

  return ({ app }) => {
    router.get('/test-files', async(ctx: Context, next: Next) => {
      ctx.body = await getTestFiles(`${dir}/**/*.spec.js`, true)
      await next()
    })

    router.get('/init',  async(ctx: Context, next: Next) => {
      ctx.body = existsSync(script) ? [ script ]: []
      await next()  
    })

    app.use(async(ctx: Context, next: Next) => {
      if (ctx.path.includes(`/${path}`)) return require('koa-send')(ctx, html)
      await next()
    })
  
    app.use(router.routes())
  }
}
