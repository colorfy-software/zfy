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
    StoreType<StoresDataType[StoreNameType]>
  > = StoreApi<StoreType<StoresDataType[StoreNameType]>>
> = (
  storeName: StoreNameType,
  config: CreateStoreConfigType<StoresDataType[StoreNameType]>,
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
) => CreateStoreConfigType<StoresDataType[StoreNameType], StoreApiType>

export type QueueTaskType<
  StoresDataType extends Record<string, any> = Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
> = {
  set: SetState<StoreType<StoresDataType[StoreNameType]>>
  producer: (store: StoreType<StoresDataType[StoreNameType]>) => void
}

export type QueueType<
  StoresDataType extends Record<string, any> = Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
> = QueueTaskType<StoresDataType, StoreNameType>[]

export interface StoreType<StoreDataType> extends State {
  data: StoreDataType
  reset: () => void
  update: (producer: (data: StoreType<StoreDataType>['data']) => void) => void
}

export type CreateStoreConfigType<
  StoreDataType,
  StoreApiType extends StoreApi<StoreType<StoreDataType>> = StoreApi<
    StoreType<StoreDataType>
  >
> = StateCreator<
  StoreType<StoreDataType>,
  SetState<StoreType<StoreDataType>>,
  GetState<StoreType<StoreDataType>>,
  StoreApiType
>

export interface CreateStoreOptionsType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
> {
  log?: boolean
  persist?: Omit<
    PersistOptions<StoreType<StoresDataType>>,
    'blacklist' | 'whitelist'
  > & {
    name: StoreNameType
    getStorage: Exclude<
      PersistOptions<StoreType<StoresDataType>>['getStorage'],
      undefined
    >
  }
  customMiddlewares?: ZfyMiddlewareType<StoresDataType, StoreNameType>[]
}

export type CreateStoreType<StoreDataType> = UseBoundStore<
  StoreType<StoreDataType>
> & {
  persist?: StoreApiWithPersist<StoreType<StoreDataType>>['persist']
}
