import type {
  State,
  GetState,
  SetState,
  StoreApi,
  StateCreator,
  UseBoundStore,
  EqualityChecker,
} from 'zustand'
import type {
  PersistOptions,
  StoreApiWithPersist,
  StoreApiWithSubscribeWithSelector,
} from 'zustand/middleware'

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
  subscribe?: boolean
  persist?: Omit<
    PersistOptions<StoreType<StoresDataType, StoreNameType>>,
    'name' | 'blacklist' | 'whitelist'
  > & {
    name?: Exclude<StoreNameType, number | symbol>
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
  subscribeWithSelector?: StoreApiWithSubscribeWithSelector<
    StoreType<StoresDataType, StoreNameType>
  >['subscribe']
}

export type InitStoresResetOptionsType<
  StoresDataType extends Record<string, any>
> = {
  omit?: Array<keyof StoresDataType>
}

export type InitStoresType<StoresDataType extends Record<string, any>> = {
  stores: {
    [StoreNameType in keyof StoresDataType]: CreateStoreType<
      StoresDataType,
      StoreNameType
    >
  } & {
    rehydrate: () => Promise<boolean>
    reset: (options?: InitStoresResetOptionsType<StoresDataType>) => void
  }
  useStores: <
    StoreNameType extends Exclude<keyof StoresDataType, number | symbol>,
    Output
  >(
    storeName: StoreNameType,
    selector: (data: StoresDataType[StoreNameType]) => Output,
    equalityFn?: EqualityChecker<Output>
  ) => Output
}
