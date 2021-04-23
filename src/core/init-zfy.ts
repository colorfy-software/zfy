import type { ZfyConfigType } from '../types'

import { setConfig } from '../internals/config'
import { validateConfig } from '../internals/validation'

/**
 * Function that initializes the library.
 * @param config - `ZfyConfigType`— Configuration object.
 */
export default function (config: ZfyConfigType) {
  validateConfig(config)
  setConfig(config)
}
