import { defaultConfig, getConfig, setConfig } from '../../internals/config'

describe('🧠 Internals > config:', () => {
  it('getConfig() returns the default config', () => {
    expect(getConfig()).toStrictEqual(defaultConfig)

    expect.assertions(1)
  })

  it('setConfig() updates the default config', () => {
    const initialConfig = getConfig()

    setConfig({ enableLogging: true })

    const expectedConfig = { ...defaultConfig, enableLogging: true }

    expect(initialConfig).not.toStrictEqual(expectedConfig)
    expect(getConfig()).toStrictEqual(expectedConfig)

    expect.assertions(2)
  })
})
