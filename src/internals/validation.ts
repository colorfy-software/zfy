import type {
  ZfyConfigType,
  CreateStoreType,
  CreateStoreOptionsType,
} from '../types'

import invariant from './invariant'
import { getConfig } from './config'

export function validateConfig(config: Partial<ZfyConfigType>) {
  invariant(config, 'You need to provide a configuration object to initZfy()')

  invariant(
    typeof config?.serialize === 'undefined' ||
      config.serialize === false ||
      typeof config.serialize === 'function',
    "You can only provide 'false' or a function to 'serialize' in initZfy() configuration object."
  )

  invariant(
    typeof config?.deserialize === 'undefined' ||
      config.deserialize === false ||
      typeof config.deserialize === 'function',
    "You can only provide 'false' or a function to 'deserialize' in initZfy() configuration object."
  )
}

export function validateConfigForPersistence() {
  const { persistKey, storage } = getConfig()

  invariant(
    persistKey,
    "You need to provide a 'persistKey' to initZfy() configuration object."
  )

  invariant(
    storage,
    "You need to provide a 'storage' to initZfy() configuration object."
  )

  invariant(
    storage?.setItem && typeof storage?.setItem === 'function',
    "The 'storage' you provided to initZfy() configuration object needs to provide a 'setItem' function."
  )

  invariant(
    storage?.getItem && typeof storage?.getItem === 'function',
    "The 'storage' you provided to initZfy() configuration object needs to provide a 'getItem' function."
  )
}

export function validatePersistGate(
  stores: Record<string, CreateStoreType<any>>
) {
  invariant(
    Object.keys(stores).length,
    "You must provide an object with your zustand stores to <PersisGate /> 'stores' prop."
  )
}

export function validateUseRehydrate(
  stores: Record<string, CreateStoreType<any>>
) {
  invariant(
    Object.keys(stores).length,
    'You must provide an object with your zustand stores to validateUseRehydrate().'
  )
}

export function validateCreateStore<
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
>({
  name,
  data,
  options,
}: {
  name: StoreNameType
  data: any
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
}) {
  invariant(
    name && typeof name === 'string',
    'You need to provide your store name string to createStore() as its first argument.'
  )

  invariant(
    data !== null && data !== undefined,
    `You need to provide some initial data to your ${name} store via createStore() 2nd argument.`
  )

  invariant(
    !options ||
      (typeof options === 'object' && options.log === undefined) ||
      (typeof options === 'object' && typeof options.log === 'boolean'),
    `You need to provide a boolean to ${name}'s createStore() options.log, ${typeof options?.log} is not a boolean.`
  )

  if (options?.persist) {
    validateConfigForPersistence()
  }

  invariant(
    !options ||
      (typeof options === 'object' && options.persist === undefined) ||
      (typeof options === 'object' && typeof options.persist === 'boolean'),
    `You need to provide a boolean to ${name}'s createStore() options.persist.`
  )
}
