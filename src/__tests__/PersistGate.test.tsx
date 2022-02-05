import React from 'react'
import { Text, View } from 'react-native'
import { render, waitFor } from '@testing-library/react-native'

import { data, sleep, SyncStorage, AsyncStorage, rehydratedData } from '.'
import PersistGate from '../core/PersistGate'
import createStore from '../core/create-store'

describe('🚪 Core > PersistGate:', () => {
  it('renders loader and rehydrates with sync storage', async () => {
    const loader = jest.fn()
    const store = createStore('jest', data, {
      persist: { getStorage: () => SyncStorage },
    })

    const { toJSON } = await waitFor(() =>
      render(
        <PersistGate stores={[store]} loader={loader}>
          <View>
            <Text>My App</Text>
          </View>
        </PersistGate>
      )
    )

    expect(toJSON()).toMatchSnapshot()
    expect(loader).toHaveBeenCalled()
    expect(store.getState().data).toEqual(rehydratedData)

    expect.assertions(3)
  })

  it('renders loader and rehydrates with async storage', async () => {
    const loader = jest.fn()
    const store = createStore('jest', data, {
      persist: { getStorage: () => AsyncStorage },
    })

    // FIXME: Fix act issue:
    // Warning: An update to PersistGate inside a test was not wrapped in act(...).
    const { toJSON } = render(
      <PersistGate stores={[store]} loader={loader}>
        <View>
          <Text>My App</Text>
        </View>
      </PersistGate>
    )

    expect(toJSON()).toMatchSnapshot()
    expect(loader).toHaveBeenCalled()
    await sleep(250)

    expect(store.getState().data).toEqual(rehydratedData)

    expect.assertions(3)
  })
})
