import type { SetState, State, StateCreator, UseStore } from 'zustand'

export interface ZfyConfigType {
  storage?: {
    getItem: Function
    setItem: Function
  }
  persistKey?: string
  serialize?: false | Function
  deserialize?: false | Function
  enableLogging?: boolean
}

export type ZfyMiddlewareType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
> = (
  store: StoreNameType,
  config: CreateStoreConfigType<StoresDataType[StoreNameType]>
) => CreateStoreConfigType<StoresDataType[StoreNameType]>

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
  isRehydrated?: boolean
  update: (producer: (store: StoreType<StoreDataType>) => void) => void
  rehydrate?: (persistedData: { data: StoreDataType }) => void
  reset: () => void
}

export type CreateStoreConfigType<StoreDataType> = StateCreator<
  StoreType<StoreDataType>
>

export interface CreateStoreOptionsType<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
> {
  log?: boolean
  persist?: { lazyRehydration: boolean }
  customMiddlewares?: ZfyMiddlewareType<StoresDataType, StoreNameType>[]
}

export type CreateStoreType<StoreDataType> = UseStore<StoreType<StoreDataType>>
