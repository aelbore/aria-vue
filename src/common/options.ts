
export interface Options {
  port?: number
  script?: string
  dir?: string
  headless?: boolean
  path?: string
  html?: string,
  watch?: boolean
  hostname?: string
  patch?: boolean
}

export interface WatchOptions extends Pick<
  Options, 
    'port' | 
    'html' | 
    'path' | 
    'headless' |
    'hostname'
  > {
  files?: string | string[]
}