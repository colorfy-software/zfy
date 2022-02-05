import React, { useState } from 'react'
import { initStores } from '@colorfy-software/zfy'
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native'

import type { StoresDataType } from './types'

import appStore from './stores/app-store'
import userStore from './stores/user-store'

const { useStores } = initStores<StoresDataType>([appStore, userStore])

const Info = (): JSX.Element => {
  const name = userStore(({ data }) => data.name)
  const backgroundColor = useStores('app', (data) => data.backgroundColor)

  const [formName, setFormName] = useState(name)
  const [formBackgroundColor, setFormBackgroundColor] =
    useState(backgroundColor)

  const saveName = () =>
    userStore.getState().update((data) => {
      data.name = formName
    })

  const saveBackgroundColor = () =>
    appStore.getState().update((data) => {
      data.backgroundColor = formBackgroundColor.toLowerCase()
    })

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{name ?? 'N/C'}</Text>
      <TextInput
        value={formName}
        placeholder="Name"
        returnKeyType="send"
        style={styles.input}
        onChangeText={setFormName}
        onSubmitEditing={saveName}
      />
      <TextInput
        placeholder="Color"
        autoCorrect={false}
        returnKeyType="send"
        autoCapitalize="none"
        style={styles.input}
        value={formBackgroundColor}
        onChangeText={setFormBackgroundColor}
        onSubmitEditing={saveBackgroundColor}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
  },
})

export default Info
