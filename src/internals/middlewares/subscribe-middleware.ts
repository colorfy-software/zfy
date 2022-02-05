import type {
  EqualityChecker,
  StateListener,
  StateSelector,
  StateSliceListener,
  StoreApi,
} from 'zustand'
import type { StoreApiWithSubscribeWithSelector } from 'zustand/middleware'

import type {
  StoreType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

// NOTE: Adapted from https://github.com/pmndrs/zustand/blob/main/src/middleware/subscribeWithSelector.ts.
const middleware =
  <
    StoresDataType extends Record<string, any>,
    StoreNameType extends keyof StoresDataType
  >(
    _: StoreNameType,
    config: CreateStoreConfigType<StoresDataType, StoreNameType>,
    __?: CreateStoreOptionsType<StoresDataType, StoreNameType>
  ): CreateStoreConfigType<
    StoresDataType,
    StoreNameType,
    StoreApi<StoreType<StoresDataType, StoreNameType>> & {
      subscribeWithSelector: StoreApiWithSubscribeWithSelector<
        StoreType<StoresDataType, StoreNameType>
      >['subscribe']
    }
  > =>
  (set, get, api): StoreType<StoresDataType, StoreNameType> => {
    const deprecatedSubscribe = api.subscribe

    // @ts-expect-error FIXME: Deprecated subscribe signature missing.
    api.subscribeWithSelector = <StateSlice>(
      selector: StateSelector<
        StoreType<StoresDataType, StoreNameType>,
        StateSlice
      >,
      providedListener: StateSliceListener<StateSlice>,
      options?:
        | {
            equalityFn?: EqualityChecker<StateSlice>
            fireImmediately?: boolean
          }
        | undefined
    ) => {
      let listener: StateListener<StoreType<StoresDataType, StoreNameType>> =
        selector

      if (providedListener) {
        const equalityFn = options?.equalityFn || Object.is
        let currentSlice = selector(api.getState())

        listener = (state) => {
          const nextSlice = selector(state)
          if (!equalityFn(currentSlice, nextSlice)) {
            const previousSlice = currentSlice
            providedListener((currentSlice = nextSlice), previousSlice)
          }
        }

        if (options?.fireImmediately) {
          providedListener(currentSlice, currentSlice)
        }
      }

      return deprecatedSubscribe(listener)
    }

    return config(set, get, api)
  }

export default middleware
