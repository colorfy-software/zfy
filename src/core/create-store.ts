import create from 'zustand'
import produce from 'immer'

import type {
  StoreType,
  QueueType,
  QueueTaskType,
  CreateStoreType,
  CreateStoreOptionsType,
} from '../types'

import { getConfig } from '../internals/config'
import { validateCreateStore } from '../internals/validation'
import createMiddlewares from '../internals/create-middlewares'

/**
 * Function that creates and returns a zustand store.
 * @param name - `string`— Name of the store.
 * @param data - `Record<string, any>`— Initial data of the store.
 * @param options - `CreateStoreOptionsType`— Optional. Config to use for store setup.
 */
export default function <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
>(
  name: StoreNameType,
  data: StoresDataType[StoreNameType],
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
): CreateStoreType<StoresDataType[StoreNameType]> {
  validateCreateStore<StoresDataType, StoreNameType>({ name, data, options })

  let queue: QueueType = []
  const rehydrateLazily = options?.persist?.lazyRehydration
  const applyMiddlewares = createMiddlewares(options)

  const store = create<StoreType<StoresDataType[StoreNameType]>>(
    applyMiddlewares(name, (set) => ({
      data,
      update: (producer): void =>
        rehydrateLazily
          ? addToQueue({ set, producer })
          : set(produce((zStore) => producer(zStore))),
      rehydrate: (persistedData: {
        data: StoresDataType[StoreNameType]
      }): void => set(persistedData),
      reset: (): void => set({ data }),
      ...(rehydrateLazily && { isRehydrated: false }),
    }))
  )

  const runQueue = () => {
    const tasksToRun = queue.length

    if (tasksToRun) {
      const task = queue[0]
      task.set(produce((zStore) => task.producer(zStore)))
    }

    if (tasksToRun > 1) {
      queue = queue.slice(0, queue.length - 1)
      runQueue()
    } else {
      queue = []
    }
  }

  const addToQueue = (queueTask: QueueTaskType) => {
    queue = [...queue, queueTask]
    if (store.getState().isRehydrated) runQueue()
  }

  const rehydrateData = async () => {
    const { deserialize, persistKey, storage } = getConfig()
    const onRehydrate = (persistedData?: any) => {
      store.getState()?.rehydrate?.(persistedData)
      store.setState({ isRehydrated: true })

      runQueue()
    }

    Promise.resolve(storage?.getItem?.(`@${persistKey}Store:${name}`)).then(
      (response) => {
        if (response && typeof deserialize === 'function') {
          Promise.resolve(deserialize(response)).then(onRehydrate)
        } else if (response) onRehydrate(response)
      }
    )
  }

  if (options?.persist?.lazyRehydration) rehydrateData()

  return store
}
