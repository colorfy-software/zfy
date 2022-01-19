import { registerRootComponent } from 'expo'
import { initZfy } from '@colorfy-software/zfy'
import AsyncStorage from '@react-native-async-storage/async-storage'

import App from './src/App'
import { name as appName } from './app.json'

initZfy({
  persistKey: appName,
  storage: AsyncStorage,
  enableLogging:
    global?.location?.pathname?.includes('/debugger-ui') ||
    global?.__REMOTEDEV__,
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
