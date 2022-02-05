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
 * @param storeName - Name of the store.
 * @param data - Initial data of the store.
 * @param options - Optional. Config to use for store setup.
 */
export default function <StoreDataType extends unknown>(
  storeName: string,
  data: StoreDataType,
  options?: CreateStoreOptionsType<StoreDataType>
): CreateStoreType<StoreDataType> {
  validateCreateStore<StoreDataType>({
    storeName,
    data,
    options,
  })

  const applyMiddlewares = createMiddlewares(storeName, options) as (
    n: string,
    s: CreateStoreConfigType<StoreDataType>
  ) => CreateStoreConfigType<StoreDataType>

  return create<StoreType<StoreDataType>>(
    applyMiddlewares(storeName, (set) => ({
      data,
      name: storeName,
      update: (producer): void =>
        set(
          produce((currentStore: StoreType<StoreDataType>) => {
            producer(currentStore.data)
          })
        ),
      reset: (): void => set({ data }),
    }))
  )
}
