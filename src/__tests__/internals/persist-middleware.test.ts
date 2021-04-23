import {
  data,
  SyncStorage,
  AsyncStorage,
  rehydratedData,
  persistentStorage,
  assertStoreContent,
  assertLazyStoreRehydration,
} from '../helpers'
import initZfy from '../../core/init-zfy'
import createStore from '../../core/create-store'

describe('📌 Internals > persistMiddleware():', () => {
  it('works with serializing synchronous storage', () => {
    initZfy({
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })

    const store = createStore('jest1', data, {
      persist: { lazyRehydration: true },
    })

    const dataUpdate = { file: 'updated' }

    return assertLazyStoreRehydration({
      store,
      onRehydrate: async () => {
        assertStoreContent({
          store,
          isRehydrated: true,
          expectedData: rehydratedData,
        })

        await store.getState().update?.((jest1) => {
          jest1.data = dataUpdate
        })

        expect(store.getState().data).toStrictEqual(dataUpdate)
        expect(
          JSON.parse(persistentStorage[`@appPersistKeyStore:jest1`])
        ).toStrictEqual({ data: dataUpdate })

        expect.assertions(7)
      },
    })
  })

  it('works with non-serializing synchronous storage', () => {
    initZfy({
      serialize: false,
      deserialize: false,
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })

    const store = createStore('jest2', data, {
      persist: { lazyRehydration: true },
    })

    const dataUpdate = { file: 'updated' }

    return assertLazyStoreRehydration({
      store,
      onRehydrate: async () => {
        assertStoreContent({
          store,
          isRehydrated: true,
          expectedData: rehydratedData,
        })

        await store.getState().update?.((jest2) => {
          jest2.data = dataUpdate
        })

        expect(store.getState().data).toStrictEqual(dataUpdate)
        expect(persistentStorage[`@appPersistKeyStore:jest2`]).toStrictEqual({
          data: dataUpdate,
        })

        expect.assertions(7)
      },
    })
  })

  it('works with serializing asynchronous storage', () => {
    initZfy({
      storage: AsyncStorage,
      persistKey: 'appPersistKey',
    })

    const store = createStore('jest3', data, {
      persist: { lazyRehydration: true },
    })

    const dataUpdate = { file: 'updated' }

    return assertLazyStoreRehydration({
      store,
      onRehydrate: async () => {
        assertStoreContent({
          store,
          isRehydrated: true,
          expectedData: rehydratedData,
        })

        await store.getState().update?.((jest3) => {
          jest3.data = dataUpdate
        })

        expect(store.getState().data).toStrictEqual(dataUpdate)
        expect(
          JSON.parse(persistentStorage[`@appPersistKeyStore:jest3`])
        ).toStrictEqual({ data: dataUpdate })

        expect.assertions(7)
      },
    })
  })

  it('works with non-serializing asynchronous storage', () => {
    initZfy({
      serialize: false,
      deserialize: false,
      storage: AsyncStorage,
      persistKey: 'appPersistKey',
    })

    const store = createStore('jest4', data, {
      persist: { lazyRehydration: true },
    })

    const dataUpdate = { file: 'updated' }

    return assertLazyStoreRehydration({
      store,
      onRehydrate: async () => {
        assertStoreContent({
          store,
          isRehydrated: true,
          expectedData: rehydratedData,
        })

        await store.getState().update?.((jest4) => {
          jest4.data = dataUpdate
        })

        expect(store.getState().data).toStrictEqual(dataUpdate)
        expect(persistentStorage[`@appPersistKeyStore:jest4`]).toStrictEqual({
          data: dataUpdate,
        })

        expect.assertions(7)
      },
    })
  })
})
