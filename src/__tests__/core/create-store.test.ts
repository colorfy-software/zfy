import { waitFor } from '@testing-library/react-native'

import type { ZfyMiddlewareType } from '../../types'

import {
  data,
  SyncStorage,
  rehydratedData,
  persistentStorage,
  assertStoreContent,
  assertLazyStoreRehydration,
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

  it('works with lazy persist middleware enabled', () => {
    const store = createStore('jest', data, {
      persist: { lazyRehydration: true },
    })
    assertLazyStoreRehydration({ store })
  })

  it('works with eager persist middleware enabled', () => {
    const store = createStore('jest', data, {
      persist: { lazyRehydration: false },
    })
    assertStoreContent({ store, expectedData: data })
  })

  it('works with all provided middlewares enabled', () => {
    const store = createStore('jest', data, {
      log: true,
      persist: { lazyRehydration: true },
    })

    assertLazyStoreRehydration({ store })
  })

  it('works with customMiddlewares provided', () => {
    const fn = jest.fn()
    const customMiddleware: ZfyMiddlewareType<{ jest: typeof data }, 'jest'> = (
      store,
      config
    ) => (set, get, api) =>
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
      persist: { lazyRehydration: true },
      customMiddlewares: [customMiddleware],
    })

    assertLazyStoreRehydration({
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

  it('queues updates and applies them to up-to-date store after lazy rehydration', async (done) => {
    initZfy({
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })

    const store = createStore('jest', data, {
      persist: { lazyRehydration: true },
    })

    await waitFor(() => {
      store.getState().update((jest) => {
        jest.data.file += '1'
      })

      store.getState().update((jest) => {
        jest.data.file += '2'
      })

      store.getState().update((jest) => {
        jest.data.file += '3'
      })
    })

    const updatedRehydratedData = { file: `${rehydratedData.file}123` }

    assertStoreContent({
      store,
      isRehydrated: true,
      expectedData: updatedRehydratedData,
    })

    expect(persistentStorage[`@appPersistKeyStore:jest`]).toStrictEqual(
      JSON.stringify({
        data: updatedRehydratedData,
      })
    )

    expect.assertions(6)
    done()
  })
})
