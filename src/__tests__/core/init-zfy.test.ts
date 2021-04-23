import { SyncStorage } from '../helpers'
import initZfy from '../../core/init-zfy'
import { defaultConfig, getConfig } from '../../internals/config'

describe('🚀 Core > initZfy():', () => {
  it('sets up the config when all the params are provided', () => {
    const serialize = jest.fn()
    const deserialize = jest.fn()

    const expectedConfig = {
      serialize,
      deserialize,
      enableLogging: true,
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    }

    initZfy(expectedConfig)

    expect(getConfig()).toStrictEqual(expectedConfig)

    expect.assertions(1)
  })

  it('updates the default config when partial params are provided', () => {
    const initialConfig = getConfig()

    initZfy({ enableLogging: true })

    const expectedConfig = { ...defaultConfig, enableLogging: true }

    expect(initialConfig).not.toStrictEqual(expectedConfig)
    expect(getConfig()).toStrictEqual(expectedConfig)

    expect.assertions(2)
  })
})
