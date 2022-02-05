import type { CreateStoreType, CreateStoreOptionsType } from '../types'

import invariant from './invariant'

export function validateInitStores(stores: CreateStoreType<any>[]) {
  invariant(
    Array.isArray(stores) && stores.length,
    'You must provide an array of your zustand stores to useRehydrate().'
  )
}

export function validatePersistGate(stores: CreateStoreType<any>[]) {
  invariant(
    Array.isArray(stores) && stores.length,
    "You must provide an array of your zustand stores to <PersisGate /> 'stores' prop."
  )
}

export function validateUseRehydrate(stores: CreateStoreType<any>[]) {
  invariant(
    Array.isArray(stores) && stores.length,
    'You must provide an array of your zustand stores to useRehydrate().'
  )
}

export function validateCreateStore<StoreDataType>({
  storeName,
  data,
  options,
}: {
  storeName: string
  data: any
  options?: CreateStoreOptionsType<StoreDataType>
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
    `You need to provide a boolean to ${storeName}'s createStore() options.log, ${options?.log} is not a boolean.`
  )

  invariant(
    !options ||
      (typeof options === 'object' && options.subscribe === undefined) ||
      typeof options.subscribe === 'boolean',
    `You need to provide a boolean to ${storeName}'s createStore() options.subscribe, ${options?.subscribe} is not a boolean.`
  )

  if (options?.persist) {
    validateOptionsForPersistence(storeName, options)
  }
}

export function validateOptionsForPersistence<StoreDataType>(
  storeName: string,
  options: CreateStoreOptionsType<StoreDataType>
) {
  invariant(
    !options ||
      (typeof options === 'object' && options.persist === undefined) ||
      Object.prototype.toString.call(options.persist) === '[object Object]',
    `You need to provide an object to ${storeName}'s createStore() options.persist. ${options.persist} is not an object.`
  )

  invariant(
    !options ||
      (typeof options === 'object' && options.persist === undefined) ||
      typeof options?.persist?.getStorage === 'function',
    `You need to provide the getStorage() function to ${storeName}'s createStore() options.persist.`
  )
}
