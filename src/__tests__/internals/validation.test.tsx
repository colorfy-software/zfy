import React from 'react'
import { render } from '@testing-library/react-native'

import { SyncStorage } from '../helpers'
import initZfy from '../../core/init-zfy'
import PersistGate from '../../core/PersistGate'
import createStore from '../../core/create-store'

describe('🚦 Internals > validation:', () => {
  it('validateConfig() works', () => {
    // @ts-expect-error
    expect(() => initZfy()).toThrowError(
      'You need to provide a configuration object to initZfy()'
    )

    // @ts-expect-error
    expect(() => initZfy({ serialize: true })).toThrowError(
      "You can only provide 'false' or a function to 'serialize' in initZfy() configuration object."
    )

    // @ts-expect-error
    expect(() => initZfy({ deserialize: true })).toThrowError(
      "You can only provide 'false' or a function to 'deserialize' in initZfy() configuration object."
    )

    const serialize = jest.fn()
    const deserialize = jest.fn()
    const expectedConfig = {
      serialize,
      deserialize,
      enableLogging: true,
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    }
    expect(() => initZfy(expectedConfig)).not.toThrow()

    expect.assertions(4)
  })

  it('validateConfigForPersistence() works', () => {
    initZfy({
      storage: SyncStorage,
    })
    expect(() =>
      createStore('store', 0, { persist: { lazyRehydration: true } })
    ).toThrowError(
      "You need to provide a 'persistKey' to initZfy() configuration object."
    )

    initZfy({
      persistKey: 'appPersistKey',
    })
    expect(() =>
      createStore('store', 0, { persist: { lazyRehydration: true } })
    ).toThrowError(
      "You need to provide a 'storage' to initZfy() configuration object."
    )

    initZfy({
      // @ts-expect-error
      storage: { ...SyncStorage, getItem: true },
      persistKey: 'appPersistKey',
    })
    expect(() =>
      createStore('store', 0, { persist: { lazyRehydration: true } })
    ).toThrowError(
      "The 'storage' you provided to initZfy() configuration object needs to provide a 'getItem' function."
    )

    initZfy({
      // @ts-expect-error
      storage: { ...SyncStorage, setItem: true },
      persistKey: 'appPersistKey',
    })
    expect(() =>
      createStore('store', 0, { persist: { lazyRehydration: true } })
    ).toThrowError(
      "The 'storage' you provided to initZfy() configuration object needs to provide a 'setItem' function."
    )

    expect.assertions(4)
  })

  it('validatePersistGate() works', () => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn())

    // @ts-expect-error
    expect(() => render(<PersistGate stores={{}} />)).toThrowError(
      "You must provide an object with your zustand stores to <PersisGate /> 'stores' prop."
    )

    expect.assertions(1)

    jest.spyOn(console, 'error').mockRestore()
  })

  it('validateCreateStore() works', async () => {
    initZfy({
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })

    // @ts-expect-error
    expect(() => createStore()).toThrowError(
      'You need to provide your store name string to createStore() as its first argument.'
    )

    // @ts-expect-error
    expect(() => createStore('jest')).toThrowError(
      'You need to provide some initial data to your jest store via createStore() 2nd argument.'
    )

    // @ts-expect-error
    expect(() => createStore('jest', {}, { log: null })).toThrowError(
      "You need to provide a boolean to jest's createStore() options.log, object is not a boolean."
    )

    // @ts-expect-error
    expect(() => createStore('jest', {}, { persist: null })).toThrowError(
      "You need to provide a boolean to jest's createStore() options.persist.lazyRehydration."
    )
    expect(() =>
      // @ts-expect-error
      createStore('jest', {}, { persist: { lazyRehydration: null } })
    ).toThrowError(
      "You need to provide a boolean to jest's createStore() options.persist.lazyRehydration."
    )

    expect.assertions(5)
  })
})
