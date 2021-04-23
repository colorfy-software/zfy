import { useState, useEffect } from 'react'

import type { CreateStoreType } from '../types'

import { getConfig } from '../internals/config'
import { validateUseRehydrate } from '../internals/validation'

/**
 * Hooks that rehydrates persisted stores on app launch.
 * @param stores - `Record<string, UseStore<StoreType<any>>>>`— Object containing zustand stores to rehydrate.
 * @returns `boolean`— A boolean indicating whether rehydration process is done.
 */
export default function <
  StoresType extends Record<string, CreateStoreType<any>>
>(stores: StoresType): boolean {
  const storesNames = Object.keys(stores || {})
  const [isRehydrated, setIsRehydrated] = useState(false)

  useEffect(() => {
    validateUseRehydrate(stores)
  }, [stores])

  useEffect(() => {
    ;(async () => {
      if (isRehydrated) return

      const { deserialize, persistKey, storage } = getConfig()
      for (let index = 0; index < storesNames.length; index += 1) {
        const name = storesNames[index]
        await Promise.resolve(
          storage?.getItem?.(`@${persistKey}Store:${name}`)
        ).then(async (response) => {
          if (response && typeof deserialize === 'function') {
            await Promise.resolve(deserialize(response)).then(
              (persistedData) => {
                stores[name]?.getState()?.rehydrate?.(persistedData)
              }
            )
          } else if (response) {
            stores[name]?.getState()?.rehydrate?.(response)
          }

          if (index === storesNames.length - 1) {
            setIsRehydrated(true)
          }
        })
      }
    })()
  }, [isRehydrated, stores, storesNames])

  return isRehydrated
}
