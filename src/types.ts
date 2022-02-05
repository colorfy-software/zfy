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

export interface StoreType<StoreDataType> extends State {
  name: string
  data: StoreDataType
  reset: () => void
  update: (producer: (data: StoreDataType) => void) => void
}

export type CreateStoreType<StoreDataType> = UseBoundStore<
  StoreType<StoreDataType>
> & {
  persist?: StoreApiWithPersist<StoreType<StoreDataType>>['persist']
  subscribeWithSelector?: StoreApiWithSubscribeWithSelector<
    StoreType<StoreDataType>
  >['subscribe']
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

export interface CreateStoreOptionsType<StoreDataType> {
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

export type ZfyMiddlewareType<
  StoreDataType,
  StoreApiType extends StoreApi<StoreType<StoreDataType>> = StoreApi<
    StoreType<StoreDataType>
  >
> = (
  storeName: string,
  config: CreateStoreConfigType<StoreDataType>,
  options?: CreateStoreOptionsType<StoreDataType>
) => CreateStoreConfigType<StoreDataType, StoreApiType>

export type InitStoresResetOptionsType<StoreDataType> = {
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
