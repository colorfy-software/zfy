import { renderHook } from '@testing-library/react-hooks'

import createStore from '../core/create-store'
import useRehydrate from '../core/use-rehydrate'
import { AsyncStorage, SyncStorage, data, rehydratedData } from '.'

describe('💧 Core > useRehydrate():', () => {
  /**
   * NOTE: The zustand layer is already tested.
   * @see https://github.com/pmndrs/zustand/blob/main/tests/persistSync.test.tsx
   */
  it('rehydrates with sync storage', async () => {
    const store = createStore('jest', data, {
      persist: { getStorage: () => SyncStorage },
    })

    const { result, waitForNextUpdate } = renderHook(() =>
      useRehydrate([store])
    )

    expect(result.current.valueOf()).toBeFalsy()

    await waitForNextUpdate()

    expect(result.current.valueOf()).toBeTruthy()
    expect(store.getState().data).toEqual(rehydratedData)

    expect.assertions(3)
  })

  /**
   * NOTE: The zustand layer is already tested.
   * @see https://github.com/pmndrs/zustand/blob/main/tests/persistAsync.test.tsx
   */
  it('rehydrates with async storage', async () => {
    const store = createStore('jest', data, {
      persist: { getStorage: () => AsyncStorage },
    })

    const { result, waitForNextUpdate } = renderHook(() =>
      useRehydrate([store])
    )

    expect(result.current.valueOf()).toBeFalsy()

    await waitForNextUpdate()

    expect(result.current.valueOf()).toBeTruthy()
    expect(store.getState().data).toEqual(rehydratedData)

    expect.assertions(3)
  })
})
