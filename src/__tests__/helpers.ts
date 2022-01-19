import type { CreateStoreType } from '../types'

export const data = { file: 'create-store.test.ts' }
export const rehydratedData = { file: 'rehydrated' }

export const assertStoreContent = ({
  store,
  expectedData,
  isRehydrated,
  assertions = 5,
}: {
  store: CreateStoreType<any>
  expectedData: any
  isRehydrated?: boolean
  assertions?: number
}) => {
  expect(store.getState().data).toStrictEqual(expectedData)
  expect(store.getState().isRehydrated).toBe(isRehydrated)
  expect(store.getState().rehydrate).toBeDefined()
  expect(store.getState().reset).toBeDefined()
  expect(store.getState().reset).toBeDefined()

  expect.assertions(assertions)
}

export const assertStoreRehydration = ({
  store,
  onRehydrate,
}: {
  store: CreateStoreType<any>
  onRehydrate?: Function
}) =>
  new Promise<void>((resolve) => {
    store.subscribe(({ isRehydrated }) => {
      if (isRehydrated) resolve()
    })
  }).then(() => {
    if (onRehydrate) return onRehydrate()
    assertStoreContent({
      store,
      expectedData: rehydratedData,
      isRehydrated: true,
    })
  })

export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(clearTimeout(timeout))
    }, milliseconds)
  })

export const persistentStorage: Record<string, any> = {
  [`@appPersistKeyStore:jest`]: JSON.stringify({
    data: rehydratedData,
  }),
  [`@appPersistKeyStore:jest1`]: JSON.stringify({
    data: rehydratedData,
  }),
  [`@appPersistKeyStore:jest2`]: {
    data: rehydratedData,
  },
  [`@appPersistKeyStore:jest3`]: JSON.stringify({
    data: rehydratedData,
  }),
  [`@appPersistKeyStore:jest4`]: {
    data: rehydratedData,
  },
}

export const SyncStorage = {
  getItem: (key: string) => persistentStorage[key] || null,
  setItem: (key: string, dataToPersist: any) => {
    persistentStorage[key] = dataToPersist
  },
}

export const AsyncStorage = {
  getItem: (key: string) =>
    new Promise(async (resolve) => {
      await sleep(750)
      resolve(persistentStorage[key] || null)
    }),
  setItem: (key: string, dataToPersist: any) =>
    new Promise(async (resolve) => {
      persistentStorage[key] = dataToPersist
      await sleep(250)
      resolve(null)
    }),
}
