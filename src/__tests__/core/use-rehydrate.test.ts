import { renderHook } from '@testing-library/react-hooks'

import {
  data,
  SyncStorage,
  rehydratedData,
  assertStoreContent,
} from '../helpers'
import initZfy from '../../core/init-zfy'
import createStore from '../../core/create-store'
import useRehydrate from '../../core/use-rehydrate'
import { waitFor } from '@testing-library/react-native'

describe('💧 Core > useRehydrate():', () => {
  beforeAll(() => {
    initZfy({
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })
  })

  it('rehydrates', async () => {
    const jest1Store = createStore('jest1', data)
    const jest3Store = createStore('jest3', data)

    assertStoreContent({ store: jest1Store, expectedData: data })
    assertStoreContent({ store: jest3Store, expectedData: data })

    await waitFor(() => {
      renderHook(() => useRehydrate({ jest1: jest1Store, jest3: jest3Store }))
    })

    assertStoreContent({ store: jest1Store, expectedData: rehydratedData })
    assertStoreContent({ store: jest3Store, expectedData: rehydratedData })

    expect.assertions(20)
  })
})
