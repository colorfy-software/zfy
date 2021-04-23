import type { ZfyConfigType } from '../types'

let config: Partial<ZfyConfigType> = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
}

export const defaultConfig = config

export function getConfig(): Partial<ZfyConfigType> {
  return config
}

export function setConfig(
  newConfig: Partial<ZfyConfigType>
): Partial<ZfyConfigType> {
  config = {
    ...newConfig,
    serialize:
      newConfig.serialize ||
      (newConfig.serialize === false ? false : defaultConfig.serialize),
    deserialize:
      newConfig.deserialize ||
      (newConfig.deserialize === false ? false : defaultConfig.deserialize),
  }
  return config
}

export default config
