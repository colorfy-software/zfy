import type { CreateStoreType, CreateStoreOptionsType } from '../types'

import invariant from './invariant'

export function validatePersistGate(stores: CreateStoreType<any, any>[]) {
  invariant(
    Array.isArray(stores) && stores.length,
    "You must provide an array of your zustand stores to <PersisGate /> 'stores' prop."
  )
}

export function validateUseRehydrate(stores: CreateStoreType<any, any>[]) {
  invariant(
    Array.isArray(stores) && stores.length,
    'You must provide an array of your zustand stores to useRehydrate().'
  )
}

export function validateCreateStore<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
>({
  storeName,
  data,
  options,
}: {
  storeName: StoreNameType
  data: any
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
}) {
  invariant(
    storeName && typeof storeName === 'string',
    'You need to provide a unique store name string to createStore() as its first argument.'
  )

  invariant(
    data !== null && data !== undefined,
    `You need to provide some initial data to your ${storeName} store via createStore() 2nd argument.`
  )

  invariant(
    !options ||
      (typeof options === 'object' && options.log === undefined) ||
      typeof options.log === 'boolean',
    `You need to provide a boolean to ${storeName}'s createStore() options.log, ${typeof options?.log} is not a boolean.`
  )

  if (options?.persist) {
    validateOptionsForPersistence(storeName, options)
  }
}

export function validateOptionsForPersistence<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType
>(
  storeName: StoreNameType,
  options: CreateStoreOptionsType<StoresDataType, StoreNameType>
) {
  invariant(
    !options ||
      (typeof options === 'object' && options.persist === undefined) ||
      typeof options?.persist?.getStorage === 'function',
    `You need to provide the getStorage() function to ${storeName}'s createStore() options.persist.`
  )
}
