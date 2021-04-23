import type { CreateStoreConfigType, StoreType } from '../types'
import { getConfig } from './config'

const logger = <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
>(
  store: StoreNameType,
  config: CreateStoreConfigType<StoresDataType[StoreNameType]>
): CreateStoreConfigType<StoresDataType[StoreNameType]> => (
  set,
  get,
  api
): StoreType<StoresDataType[StoreNameType]> =>
  config(
    (args) => {
      const prevState = get().data
      const payload = typeof args === 'function' ? args(get()) : args

      set(args)

      if (getConfig().enableLogging) {
        const newState = get().data

        console.group(
          `%c🗂 ${store.toLocaleString().toLocaleUpperCase()} STORE UPDATED`,
          'font-weight:bold'
        )
        console.log(
          '%cprevState',
          'font-weight:bold; color: #9E9E9E',
          prevState
        )
        console.log('%cpayload', 'font-weight:bold; color: #27A3F7', payload)
        console.log('%cnewState', 'font-weight:bold; color: #C6E40A', newState)
        console.groupEnd()
      }
    },
    get,
    api
  )

export default logger
