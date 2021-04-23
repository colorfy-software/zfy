import { defaultConfig, getConfig, setConfig } from '../../internals/config'

describe('🧠 Internals > config:', () => {
  it('getConfig() returns the default config', () => {
    expect(getConfig()).toStrictEqual(defaultConfig)

    expect.assertions(1)
  })

  it('setConfig() updates the default config', () => {
    const initialConfig = getConfig()
    const expectedConfig = { ...defaultConfig, enableLogging: true }

    setConfig(expectedConfig)

    expect(expectedConfig).not.toStrictEqual(initialConfig)
    expect(getConfig()).toStrictEqual(expectedConfig)

    expect.assertions(2)
  })
})
