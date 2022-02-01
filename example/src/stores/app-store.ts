import { MMKV } from 'react-native-mmkv'
import { createStore } from '@colorfy-software/zfy'

import type { StoresDataType } from '../types'

export const initialState: StoresDataType['app'] = {
  backgroundColor: '#fff',
}

export const storage = new MMKV({ id: 'app' })

export default createStore<StoresDataType, 'app'>('app', initialState, {
  log: true,
  persist: {
    name: 'app',
    onRehydrateStorage: (state) =>
      console.debug(
        `💧 App rehydration:  ${JSON.stringify(state?.data, null, 2)}`
      ),
    getStorage: () => ({
      getItem: (name) => storage.getString(name) ?? null,
      setItem: async (name, value) => storage.set(name, value),
      removeItem: async (name) => storage.delete(name),
    }),
  },
})
