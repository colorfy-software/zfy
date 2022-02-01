import create from 'zustand'
import produce from 'immer'

import type {
  StoreType,
  CreateStoreType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../types'

import { validateCreateStore } from '../internals/validations'
import createMiddlewares from '../internals/middlewares/create-middlewares'

/**
 * Function that creates and returns a zustand store.
 * @param storeName - `string`— Name of the store.
 * @param data - `Record<string, any>`— Initial data of the store.
 * @param options - `CreateStoreOptionsType`— Optional. Config to use for store setup.
 */
export default function <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
>(
  storeName: StoreNameType,
  data: StoresDataType[StoreNameType],
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
): CreateStoreType<StoresDataType, StoreNameType> {
  validateCreateStore<StoresDataType, StoreNameType>({
    storeName,
    data,
    options,
  })

  const applyMiddlewares = createMiddlewares(storeName, options) as (
    n: StoreNameType,
    s: CreateStoreConfigType<StoresDataType, StoreNameType>
  ) => CreateStoreConfigType<StoresDataType, StoreNameType>

  return create<StoreType<StoresDataType, StoreNameType>>(
    applyMiddlewares(storeName, (set) => ({
      name: storeName,
      data,
      update: (producer): void =>
        set(
          produce((currentStore: StoreType<StoresDataType, StoreNameType>) => {
            producer(currentStore.data)
          })
        ),
      reset: (): void => set({ data }),
    }))
  )
}
