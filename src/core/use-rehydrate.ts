import { useState, useEffect } from 'react'

import type { CreateStoreType } from '../types'

import { validateUseRehydrate } from '../internals/validations'

/**
 * Hooks that rehydrates persisted stores on app launch.
 * @param stores - `Record<string, CreateStoreType<any>>`— Object containing zustand stores to rehydrate.
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

      for (const name of storesNames) {
        await stores[name]?.persist?.rehydrate?.()

        if (storesNames.indexOf(name) === storesNames.length - 1) {
          setIsRehydrated(true)
        }
      }
    })()
  }, [isRehydrated, stores, storesNames])

  return isRehydrated
}
