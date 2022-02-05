import type { ZfyMiddlewareType } from '../types'

import { data, SyncStorage, rehydratedData, assertStoreContent } from '.'
import createStore from '../core/create-store'

describe('🐣 Core > createStore():', () => {
  it('validates config', () => {
    // @ts-expect-error
    expect(() => createStore()).toThrow(
      'You need to provide a unique store name string to createStore() as its first argument.'
    )
    // @ts-expect-error
    expect(() => createStore(undefined, data)).toThrow(
      'You need to provide a unique store name string to createStore() as its first argument.'
    )
    // @ts-expect-error
    expect(() => createStore('jest')).toThrow(
      'You need to provide some initial data to your jest store via createStore() 2nd argument.'
    )

    expect.assertions(3)
  })

  it('works with minimal config', () => {
    const store = createStore('jest', data)
    assertStoreContent({ store, expectedData: data })

    expect.assertions(4)
  })

  it('works with log middleware enabled', () => {
    const consoleGroup = jest.spyOn(console, 'group').mockImplementation()
    const consoleDebug = jest.spyOn(console, 'debug').mockImplementation()

    // @ts-expect-error
    expect(() => createStore('jest', data, { log: 1 })).toThrow(
      "You need to provide a boolean to jest's createStore() options.log, 1 is not a boolean."
    )

    const store = createStore('jest', data, { log: true })
    assertStoreContent({ store, expectedData: data })

    store.getState().update((state) => {
      state.file = rehydratedData.file
    })

    expect(consoleGroup).toHaveBeenCalledWith(
      '%c🗂 JEST STORE UPDATED',
      'font-weight:bold'
    )
    expect(consoleDebug).toHaveBeenCalledWith(
      '%cprevState',
      'font-weight:bold; color: #9E9E9E',
      data
    )
    expect(consoleDebug).toHaveBeenCalledWith(
      '%cpayload',
      'font-weight:bold; color: #27A3F7',
      rehydratedData
    )
    expect(consoleDebug).toHaveBeenCalledWith(
      '%cnewState',
      'font-weight:bold; color: #C6E40A',
      rehydratedData
    )

    expect.assertions(9)
    consoleGroup.mockRestore()
    consoleDebug.mockRestore()
  })

  it('works with persist middleware enabled', () => {
    // @ts-expect-error
    expect(() => createStore('jest', data, { persist: true })).toThrow(
      "You need to provide an object to jest's createStore() options.persist. true is not an object."
    )
    // @ts-expect-error
    expect(() => createStore('jest', data, { persist: {} })).toThrow(
      "You need to provide the getStorage() function to jest's createStore() options.persist."
    )

    const store = createStore('jest', data, {
      persist: { getStorage: () => SyncStorage },
    })
    assertStoreContent({ store, expectedData: rehydratedData })

    expect.assertions(6)
  })

  it('works with all provided middlewares enabled', () => {
    const consoleGroup = jest.spyOn(console, 'group').mockImplementation()
    const consoleDebug = jest.spyOn(console, 'debug').mockImplementation()

    const store = createStore('jest', data, {
      persist: { getStorage: () => SyncStorage },
      log: true,
    })

    assertStoreContent({ store, expectedData: rehydratedData })

    store.getState().update((state) => {
      state.file = data.file
    })

    expect(consoleGroup).toHaveBeenCalledWith(
      '%c🗂 JEST STORE UPDATED',
      'font-weight:bold'
    )
    expect(consoleDebug).toHaveBeenCalledWith(
      '%cprevState',
      'font-weight:bold; color: #9E9E9E',
      rehydratedData
    )
    expect(consoleDebug).toHaveBeenCalledWith(
      '%cpayload',
      'font-weight:bold; color: #27A3F7',
      data
    )
    expect(consoleDebug).toHaveBeenCalledWith(
      '%cnewState',
      'font-weight:bold; color: #C6E40A',
      data
    )

    store.getState().update((state) => {
      state.file = rehydratedData.file
    })

    expect.assertions(8)
    consoleGroup.mockRestore()
    consoleDebug.mockRestore()
  })

  it('works with customMiddlewares provided', () => {
    const fn = jest.fn()
    const customMiddleware: ZfyMiddlewareType<{ jest: typeof data }, 'jest'> =
      (store, config) => (set, get, api) =>
        config(
          (args) => {
            set(args)
            fn(store)
          },
          get,
          api
        )

    const store = createStore('jest', data, {
      log: true,
      persist: { getStorage: () => SyncStorage },
      customMiddlewares: [customMiddleware],
    })

    assertStoreContent({ store, expectedData: rehydratedData })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('jest')

    expect.assertions(6)
  })
})
