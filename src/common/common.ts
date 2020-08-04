import { normalize } from 'path'
import { Options } from './options'

export * from './options'

const removeBacklash = (str: string) => {
  const paths = normalize(str).split('/')
  return (paths.length > 1) ? paths.splice(1).join('/'): paths.shift()
}

export const createUrl = ({ port, hostname, path }) => 
  `http://${hostname}:${port}/${path}`

export function normalizeOptions(options: Options) {
    const { 
      patch = false,
      script,
      headless = false,
      watch = false,
      hostname = 'localhost',
      port = 3000,
      dir = removeBacklash('test'), 
      path = removeBacklash('tests'), 
      html = removeBacklash('/node_modules/aria-vue/index.html')
    } = options
  
    return { script, patch, watch, hostname, headless, port, dir, path, html }
  }