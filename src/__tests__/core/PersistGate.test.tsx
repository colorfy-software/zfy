import React from 'react'
import { Text, View } from 'react-native'
import { render, waitFor } from '@testing-library/react-native'

import {
  data,
  SyncStorage,
  rehydratedData,
  assertStoreContent,
} from '../helpers'
import initZfy from '../../core/init-zfy'
import PersistGate from '../../core/PersistGate'
import createStore from '../../core/create-store'

describe('🚧 Core > PersistGate:', () => {
  beforeAll(() => {
    initZfy({
      storage: SyncStorage,
      persistKey: 'appPersistKey',
    })
  })

  it('renders correctly', async () => {
    const loader = jest.fn()
    const stores = { jest: createStore('jest', data) }

    const { toJSON } = await waitFor(() =>
      render(
        <PersistGate stores={stores} loader={loader}>
          <View>
            <Text>My App</Text>
          </View>
        </PersistGate>
      )
    )

    expect(toJSON()).toMatchSnapshot()
    expect(loader).toHaveBeenCalled()

    expect.assertions(2)
  })

  it('renders loader during rehydration then renders children', async () => {
    const loader = jest.fn()
    const children = jest.fn()
    const store = createStore('jest', data)

    const { toJSON } = await waitFor(() =>
      render(
        <PersistGate stores={{ jest: store }} loader={loader}>
          {children}
        </PersistGate>
      )
    )

    expect(loader).toHaveBeenCalled()
    expect(children).toHaveBeenCalled()
    assertStoreContent({ store, expectedData: rehydratedData })
    expect(toJSON()).toMatchSnapshot()

    expect.assertions(8)
  })
})
