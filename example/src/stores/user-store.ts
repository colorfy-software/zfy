import { MMKV } from 'react-native-mmkv'
import { createStore } from '@colorfy-software/zfy'

import type { StoresDataType } from '../types'

export const initialState = {} as StoresDataType['user']

export const storage = new MMKV({ id: 'user' })

const userStore = createStore<StoresDataType['user']>('user', initialState, {
  log: true,
  persist: {
    name: 'user',
    onRehydrateStorage: () => {
      console.debug('💧 User rehydration started')
      return (state, error) => {
        if (error) {
          console.debug('❌ User rehydration error', error)
        } else {
          console.debug(
            `💧 User rehydration done:  ${JSON.stringify(state?.data, null, 2)}`
          )
        }
      }
    },
    getStorage: () => ({
      getItem: (name) => storage.getString(name) ?? null,
      setItem: (name, value) => storage.set(name, value),
      removeItem: (name) => storage.delete(name),
    }),
  },
})

export default userStore
