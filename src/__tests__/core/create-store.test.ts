import type { ZfyMiddlewareType } from '../../types'

import {
  data,
  SyncStorage,
  rehydratedData,
  assertStoreContent,
  assertStoreRehydration,
} from '../helpers'
import initZfy from '../../core/init-zfy'
import createStore from '../../core/create-store'

describe('🐣 Core > createStore():', () => {
  beforeAll(() => {
    initZfy({
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })
  })

  it('works with minimal config provided', () => {
    const store = createStore('jest', data)
    assertStoreContent({ store, expectedData: data })
  })

  it('works with log middleware enabled', () => {
    const store = createStore('jest', data, { log: true })
    assertStoreContent({ store, expectedData: data })
  })

  it('works with persist middleware enabled', () => {
    const store = createStore('jest', data, { persist: true })
    assertStoreRehydration({ store })
  })

  it('works with all provided middlewares enabled', () => {
    const store = createStore('jest', data, {
      log: true,
      persist: true,
    })

    assertStoreRehydration({ store })
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
      persist: true,
      customMiddlewares: [customMiddleware],
    })

    assertStoreRehydration({
      store,
      onRehydrate: () => {
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith('jest')

        assertStoreContent({
          store,
          assertions: 7,
          isRehydrated: true,
          expectedData: rehydratedData,
        })
      },
    })
  })
})
