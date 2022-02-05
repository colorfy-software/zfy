import { SyncStorage, rehydratedData } from './index'
import { initStores, createStore } from '../core'
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'

const dataA = { fileA: 'create-store.test.ts' }
const rehydratedDataA = { fileA: 'rehydrated' }

const dataB = { fileB: 'create-store.test.ts' }
const rehydratedDataB = { fileB: 'rehydrated' }

type StoresDataType = {
  jestA: typeof dataA
  jestB: typeof dataB
}

describe('🚀 Core > initStores():', () => {
  it('validates configs', () => {
    // @ts-expect-error
    expect(() => initStores()).toThrow(
      'You must provide an array of your zustand stores to useRehydrate().'
    )

    const storeA = createStore<StoresDataType, 'jestA'>('jestA', dataA)
    const storeB = createStore<StoresDataType, 'jestB'>('jestB', dataB)
    // @ts-expect-error FIXME: Fix union overlap
    const { useStores } = initStores<StoresDataType>([storeA, storeB])

    expect(() => {
      // @ts-expect-error
      renderHook(useStores('random', (jestA) => jestA.fileA))
    }).toThrow(
      `'random' is not a valid store name. Did you mean any of these: \n• jestA,\n• jestB`
    )

    expect.assertions(2)
  })

  it('rehydrates stores', async () => {
    const onRehydrationDone = jest.fn()
    const onRehydrateStorageSpy = jest.fn(() => onRehydrationDone)

    const storeA = createStore<StoresDataType, 'jestA'>('jestA', dataA, {
      persist: {
        getStorage: () => SyncStorage,
        onRehydrateStorage: onRehydrateStorageSpy,
      },
    })
    const storeB = createStore<StoresDataType, 'jestB'>('jestB', dataB, {
      persist: {
        getStorage: () => SyncStorage,
      },
    })

    expect(onRehydrateStorageSpy).toHaveBeenCalledWith(undefined)

    // @ts-expect-error FIXME: Fix union overlap
    const { stores } = initStores<StoresDataType>([storeA, storeB])

    const status = await stores.rehydrate()

    expect(status).toBeTruthy()
    expect(onRehydrationDone).toHaveBeenCalledWith(
      stores.jestA.getState(),
      undefined
    )
    expect(stores.jestA.getState().data).toEqual(rehydratedData)
    expect(stores.jestB.getState().data).toEqual(rehydratedData)

    expect.assertions(5)
  })

  it('reset stores', async () => {
    const storeA = createStore<StoresDataType, 'jestA'>('jestA', dataA)
    const storeB = createStore<StoresDataType, 'jestB'>('jestB', dataB)

    // @ts-expect-error FIXME: Fix union overlap
    const { stores } = initStores<StoresDataType>([storeA, storeB])

    expect(stores.jestA.getState().data).toEqual(dataA)
    expect(stores.jestB.getState().data).toEqual(dataB)

    stores.jestA.getState().update((jestA) => {
      jestA.fileA = rehydratedDataA.fileA
    })
    stores.jestB.getState().update((jestB) => {
      jestB.fileB = rehydratedDataB.fileB
    })

    expect(stores.jestA.getState().data).toEqual(rehydratedDataA)
    expect(stores.jestB.getState().data).toEqual(rehydratedDataB)

    stores.reset({ omit: ['jestB'] })

    expect(stores.jestA.getState().data).toEqual(dataA)
    expect(stores.jestB.getState().data).toEqual(rehydratedDataB)

    stores.jestB.getState().update((state) => {
      state.fileB = rehydratedDataB.fileB
    })
    stores.reset()

    expect(stores.jestA.getState().data).toEqual(dataA)
    expect(stores.jestB.getState().data).toEqual(dataB)

    expect.assertions(8)
  })

  it('returns stores', async () => {
    const store = createStore<StoresDataType, 'jestA'>('jestA', dataA)

    // @ts-expect-error FIXME: Fix union overlap
    const { stores } = initStores<StoresDataType>([store])

    expect(stores.jestA.getState().data).toEqual(dataA)
    expect(stores.rehydrate).toBeInstanceOf(Function)
    expect(stores.reset).toBeInstanceOf(Function)

    expect.assertions(3)
  })

  it('returns useStores', async () => {
    const storeA = createStore<StoresDataType, 'jestA'>('jestA', dataA)
    const storeB = createStore<StoresDataType, 'jestB'>('jestB', dataB)

    // @ts-expect-error FIXME: Fix union overlap
    const { stores, useStores } = initStores<StoresDataType>([storeA, storeB])

    const { result } = renderHook(() =>
      useStores(
        'jestA',
        (jestA) => jestA.fileA,
        (prevState, newState) => prevState === newState
      )
    )
    expect(result.current).toBe(dataA.fileA)

    act(() => {
      stores.jestA.getState().update((jestA) => {
        jestA.fileA = rehydratedDataA.fileA
      })
    })
    expect(result.current).toBe(rehydratedDataA.fileA)

    act(stores.reset)
    expect(result.current).toBe(dataA.fileA)

    expect.assertions(3)
  })
})
