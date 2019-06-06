import { KarmaOptions} from 'aria-test'
import { createVueKarmaConfig } from './config'

export * from './config'

export default function vueKarmaConfig(options?: KarmaOptions) {
  return config => createVueKarmaConfig(options)
}