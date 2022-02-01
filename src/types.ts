import type {
  State,
  GetState,
  SetState,
  StoreApi,
  StateCreator,
  UseBoundStore,
} from 'zustand'
import type { PersistOptions, StoreApiWithPersist } from 'zustand/middleware'

export type ZfyMiddlewareType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType,
  StoreApiType extends StoreApi<
    StoreType<StoresDataType, StoreNameType>
  > = StoreApi<StoreType<StoresDataType, StoreNameType>>
> = (
  storeName: StoreNameType,
  config: CreateStoreConfigType<StoresDataType, StoreNameType>,
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
) => CreateStoreConfigType<StoresDataType, StoreNameType, StoreApiType>

export interface StoreType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
> extends State {
  name: StoreNameType
  data: StoresDataType[StoreNameType]
  reset: () => void
  update: (
    producer: (data: StoreType<StoresDataType, StoreNameType>['data']) => void
  ) => void
}

export type CreateStoreConfigType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType,
  StoreApiType extends StoreApi<
    StoreType<StoresDataType, StoreNameType>
  > = StoreApi<StoreType<StoresDataType, StoreNameType>>
> = StateCreator<
  StoreType<StoresDataType, StoreNameType>,
  SetState<StoreType<StoresDataType, StoreNameType>>,
  GetState<StoreType<StoresDataType, StoreNameType>>,
  StoreApiType
>

export interface CreateStoreOptionsType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
> {
  log?: boolean
  persist?: Omit<
    PersistOptions<StoreType<StoresDataType, StoreNameType>>,
    'blacklist' | 'whitelist'
  > & {
    name: StoreNameType
    getStorage: Exclude<
      PersistOptions<StoreType<StoresDataType, StoreNameType>>['getStorage'],
      undefined
    >
  }
  customMiddlewares?: ZfyMiddlewareType<StoresDataType, StoreNameType>[]
}

export type CreateStoreType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
> = UseBoundStore<StoreType<StoresDataType, StoreNameType>> & {
  persist?: StoreApiWithPersist<
    StoreType<StoresDataType, StoreNameType>
  >['persist']
}
