import { initZfy } from '@colorfy-software/zfy'
import React, { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { name as persistKey } from '../app.json'

// WIP

export default function App() {
  useEffect(() => {
    initZfy({
      persistKey,
      enableLogging: true,
      storage: AsyncStorage,
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Result</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})
