import type {
  InitStoresType,
  CreateStoreType,
  InitStoresResetOptionsType,
} from '../types'

import invariant from '../internals/invariant'
import { validateInitStores } from '../internals/validations'

/**
 * Hooks that let you consume data from any of the stores provided to `initStores()`.
 * @param storeName - Name of the store to use.
 * @param selector - A selector function that returns the data you want to access.
 * @param equalityFn - Optional. Equality checker function.
 * @returns Data from the store returned by the selector function.
 */
export default function <
  StoresDataType extends Record<string, any>,
  StoresType extends CreateStoreType<
    StoresDataType,
    // FIXME: Fix union overlap
    keyof StoresDataType
  >[] = CreateStoreType<StoresDataType, keyof StoresDataType>[]
>(stores: StoresType): InitStoresType<StoresDataType> {
  validateInitStores(stores)

  const storesNames = stores.map((store) => store.getState().name)

  const rehydrate = () =>
    new Promise<boolean>(async (resolve) => {
      for (let index = 0; index < storesNames.length; index += 1) {
        const name = storesNames[index]

        await stores[index]?.persist?.rehydrate?.()

        if (storesNames.indexOf(name) === storesNames.length - 1) {
          return resolve(true)
        }
      }
    })

  const reset = (options: InitStoresResetOptionsType<StoresDataType>) =>
    stores
      .filter(
        (store) =>
          !options?.omit || !options.omit.includes(store.getState().name)
      )
      .forEach((store) => store.getState().reset())

  const useStores: InitStoresType<StoresDataType>['useStores'] = (
    storeName,
    selector,
    equalityFn
  ) => {
    const store = stores.find(
      (item) => item.getState().name === storeName
    ) as CreateStoreType<StoresDataType, keyof StoresDataType>

    invariant(
      store !== undefined,
      `'${storeName}' is not a valid store name. Did you mean any of these: ${storesNames.map(
        (validName) => `\n• ${validName}`
      )}`
    )

    // @ts-expect-error FIXME: Fix arbitrary instantiation type issue
    return store?.(({ data }) => selector(data), equalityFn)
  }

  let output: InitStoresType<StoresDataType> = {
    stores: stores.reduce(
      (value, store, index) => ({ ...value, [storesNames[index]]: store }),
      {
        rehydrate,
        reset,
      } as InitStoresType<StoresDataType>['stores']
    ),
    useStores,
  }

  return output
}
