import type { CreateStoreConfigType, StoreType } from '../types'
import { getConfig } from './config'

const persist = <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
>(
  store: StoreNameType,
  config: CreateStoreConfigType<StoresDataType[StoreNameType]>
): CreateStoreConfigType<StoresDataType[StoreNameType]> => (
  set,
  get,
  api
): StoreType<StoresDataType[StoreNameType]> =>
  config(
    async (args) => {
      set(args)

      const { persistKey, serialize, storage } = getConfig()

      if (typeof serialize === 'function') {
        Promise.resolve(serialize({ data: get().data })).then((data) => {
          storage?.setItem(`@${persistKey}Store:${store}`, data)
        })
      } else {
        storage?.setItem(`@${persistKey}Store:${store}`, {
          data: get().data,
        })
      }
    },
    get,
    api
  )

export default persist
