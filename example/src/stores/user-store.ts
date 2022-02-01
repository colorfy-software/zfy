import { MMKV } from 'react-native-mmkv'
import { createStore } from '@colorfy-software/zfy'

import type { StoresDataType } from '../types'

export const initialState = {} as StoresDataType['user']

export const storage = new MMKV({ id: 'user' })

const userStore = createStore<StoresDataType, 'user'>('user', initialState, {
  log: true,
  persist: {
    name: 'user',
    onRehydrateStorage: (state) =>
      console.debug(
        `💧 User rehydration:  ${JSON.stringify(state?.data, null, 2)}`
      ),
    getStorage: () => ({
      getItem: (name) => storage.getString(name) ?? null,
      setItem: async (name, value) => storage.set(name, value),
      removeItem: async (name) => storage.delete(name),
    }),
  },
})

export default userStore
