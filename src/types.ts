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
  StoreDataType extends unknown,
  StoreApiType extends StoreApi<StoreType<StoreDataType>> = StoreApi<
    StoreType<StoreDataType>
  >
> = (
  storeName: string,
  config: CreateStoreConfigType<StoreDataType>,
  options?: CreateStoreOptionsType<StoreDataType>
) => CreateStoreConfigType<StoreDataType, StoreApiType>

export interface StoreType<StoreDataType extends unknown> extends State {
  name: string
  data: StoreDataType
  reset: () => void
  update: (producer: (data: StoreDataType) => void) => void
}

export type CreateStoreConfigType<
  StoreDataType extends unknown,
  StoreApiType extends StoreApi<StoreType<StoreDataType>> = StoreApi<
    StoreType<StoreDataType>
  >
> = StateCreator<
  StoreType<StoreDataType>,
  SetState<StoreType<StoreDataType>>,
  GetState<StoreType<StoreDataType>>,
  StoreApiType
>

export interface CreateStoreOptionsType<StoreDataType extends unknown> {
  log?: boolean
  subscribe?: boolean
  persist?: Omit<
    PersistOptions<StoreType<StoreDataType>>,
    'name' | 'blacklist' | 'whitelist'
  > & {
    name?: string
    getStorage: Exclude<
      PersistOptions<StoreType<StoreDataType>>['getStorage'],
      undefined
    >
  }
  customMiddlewares?: ZfyMiddlewareType<StoreDataType>[]
}

export type CreateStoreType<StoreDataType extends unknown> = UseBoundStore<
  StoreType<StoreDataType>
> & {
  persist?: StoreApiWithPersist<StoreType<StoreDataType>>['persist']
  subscribeWithSelector?: StoreApiWithSubscribeWithSelector<
    StoreType<StoreDataType>
  >['subscribe']
}

export type InitStoresResetOptionsType<StoreDataType extends unknown> = {
  omit?: Array<keyof StoreDataType>
}

export type InitStoresType<StoresDataType> = {
  stores: {
    [StoreNameType in keyof StoresDataType]: CreateStoreType<
      StoresDataType[StoreNameType]
    >
  } & {
    rehydrate: () => Promise<boolean>
    reset: (options?: InitStoresResetOptionsType<StoresDataType>) => void
  }
  useStores: <StoreNameType extends keyof StoresDataType, Output>(
    storeName: StoreNameType,
    selector: (data: StoresDataType[StoreNameType]) => Output,
    equalityFn?: EqualityChecker<Output>
  ) => Output
}
