import React from 'react'
import { PersistGate } from '@colorfy-software/zfy'
import { StyleSheet, SafeAreaView, Text } from 'react-native'

import app from './stores/app-store'
import user from './stores/user-store'

import Info from './Info'

const Loader = () => {
  console.debug('💬 Loading...')
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <PersistGate stores={[app, user]} loader={<Loader />}>
      <Info />
    </PersistGate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 69,
    fontWeight: 'bold',
  },
})
