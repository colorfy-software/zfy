import type { StoreApi } from 'zustand'
import { persist, StoreApiWithPersist } from 'zustand/middleware'

import type {
  StoreType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

const middleware = <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
>(
  storeName: StoreNameType,
  config: CreateStoreConfigType<StoresDataType[StoreNameType]>,
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
): CreateStoreConfigType<
  StoresDataType[StoreNameType],
  StoreApi<StoreType<StoresDataType[StoreNameType]>> &
    StoreApiWithPersist<StoreType<StoresDataType[StoreNameType]>>
> => {
  const {
    name = storeName as Exclude<StoreNameType, number | symbol>,
    ...rest
  } = options?.persist ?? {}

  return persist((set, get, api) => config(set, get, api), {
    name,
    ...(rest ? rest : {}),
  })
}

export default middleware
