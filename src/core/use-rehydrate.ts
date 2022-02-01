import { useState, useEffect } from 'react'

import type { CreateStoreType } from '../types'

import { validateUseRehydrate } from '../internals/validations'

/**
 * Hooks that rehydrates persisted stores on app launch.
 * @param stores - `Array<CreateStoreType<any, any>>`— Array containing all the zustand stores to rehydrate.
 * @returns `boolean`— A boolean indicating whether rehydration process is done.
 */
export default function <StoresType extends CreateStoreType<any, any>[]>(
  stores: StoresType
): boolean {
  const storesNames = stores.map((store) => store.getState().name)
  const [isRehydrated, setIsRehydrated] = useState(false)

  useEffect(() => {
    validateUseRehydrate(stores)
  }, [stores])

  useEffect(() => {
    ;(async () => {
      if (isRehydrated) return

      for (let index = 0; index < storesNames.length; index += 1) {
        const name = storesNames[index]

        await stores[index]?.persist?.rehydrate?.()

        if (storesNames.indexOf(name) === storesNames.length - 1) {
          setIsRehydrated(true)
        }
      }
    })()
  }, [isRehydrated, stores, storesNames])

  return isRehydrated
}
