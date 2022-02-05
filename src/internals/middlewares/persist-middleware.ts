import type { StoreApi } from 'zustand'
import { persist, StoreApiWithPersist } from 'zustand/middleware'

import type {
  StoreType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

const middleware = <StoreDataType extends unknown>(
  storeName: string,
  config: CreateStoreConfigType<StoreDataType>,
  options?: CreateStoreOptionsType<StoreDataType>
): CreateStoreConfigType<
  StoreDataType,
  StoreApi<StoreType<StoreDataType>> &
    StoreApiWithPersist<StoreType<StoreDataType>>
> => {
  const { name = storeName, ...rest } = options?.persist ?? {}

  return persist((set, get, api) => config(set, get, api), {
    name,
    ...(rest ? rest : {}),
  })
}

export default middleware
