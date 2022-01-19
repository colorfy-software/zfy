import { createStore } from '@colorfy-software/zfy'

import type { StoresDataType } from '../types'

export const initialState: StoresDataType['app'] = {
  navigationState: 'auth',
  pushPermissions: false,
  isFirstDisplayOfHome: true,
}

export default createStore<StoresDataType, 'app'>('app', initialState)
