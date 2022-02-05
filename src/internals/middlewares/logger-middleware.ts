import type {
  StoreType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

const middleware =
  <StoreDataType extends unknown>(
    storeName: string,
    config: CreateStoreConfigType<StoreDataType>,
    options?: CreateStoreOptionsType<StoreDataType>
  ): CreateStoreConfigType<StoreDataType> =>
  (set, get, api): StoreType<StoreDataType> =>
    config(
      (args) => {
        const prevState = get().data
        const payload = typeof args === 'function' ? args(get()) : args

        set(args)

        if (options?.log) {
          const newState = get().data

          console.group(
            `%c🗂 ${storeName
              .toLocaleString()
              .toLocaleUpperCase()} STORE UPDATED`,
            'font-weight:bold'
          )
          console.debug(
            '%cprevState',
            'font-weight:bold; color: #9E9E9E',
            prevState
          )
          console.debug(
            '%cpayload',
            'font-weight:bold; color: #27A3F7',
            (payload as StoreType<StoreDataType>).data
          )
          console.debug(
            '%cnewState',
            'font-weight:bold; color: #C6E40A',
            newState
          )
          console.groupEnd()
        }
      },
      get,
      api
    )

export default middleware
