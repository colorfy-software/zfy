import type { CreateStoreType } from '../types'

export const data = { file: 'create-store.test.ts' }
export const rehydratedData = { file: 'rehydrated' }

const storeContent = (name: string) => ({
  state: { name, data: rehydratedData },
  version: 0,
})

export const persistentStorage: Record<string, any> = {
  jest: JSON.stringify(storeContent('jest')),
  jestA: JSON.stringify(storeContent('jestA')),
  jestB: JSON.stringify(storeContent('jestB')),
}

export const SyncStorage = {
  getItem: (key: string): string | null => persistentStorage[key] ?? null,
  setItem: (key: string, value: any): void => {
    persistentStorage[key] = value
  },
  removeItem: (key: string): void => {
    persistentStorage[key] = null
  },
}

export const AsyncStorage = {
  getItem: (key: string) =>
    new Promise<string | null>(async (resolve) => {
      await sleep(250)
      resolve(persistentStorage[key] || null)
    }),
  setItem: (key: string, value: any) =>
    new Promise<void>(async (resolve) => {
      persistentStorage[key] = value
      await sleep(250)
      resolve()
    }),
  removeItem: (key: string) =>
    new Promise<void>(async (resolve) => {
      persistentStorage[key] = null
      await sleep(250)
      resolve()
    }),
}

export const sleep = (milliSeconds: number) =>
  new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      resolve(clearTimeout(timeout))
    }, milliSeconds)
  })

export const assertStoreContent = ({
  store,
  expectedName = 'jest',
  expectedData,
}: {
  store: CreateStoreType<any>
  expectedName?: string
  expectedData: any
}) => {
  expect(store.getState().name).toStrictEqual(expectedName)
  expect(store.getState().data).toStrictEqual(expectedData)
  expect(store.getState().update).toBeDefined()
  expect(store.getState().reset).toBeDefined()
}
