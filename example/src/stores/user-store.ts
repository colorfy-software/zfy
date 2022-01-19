import { createStore } from '@colorfy-software/zfy'

import type { StoresDataType } from '../types'

export const initialState = {} as StoresDataType['user']

const userStore = createStore('user', initialState, {
  log: true,
  persist: true,
})

export default userStore
