import type {
  StoreType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

const middleware =
  <
    StoresDataType extends Record<string, any>,
    StoreNameType extends keyof StoresDataType
  >(
    storeName: StoreNameType,
    config: CreateStoreConfigType<StoresDataType, StoreNameType>,
    options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
  ): CreateStoreConfigType<StoresDataType, StoreNameType> =>
  (set, get, api): StoreType<StoresDataType, StoreNameType> =>
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
            (payload as StoreType<StoresDataType, StoreNameType>).data
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
