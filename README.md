<h1 align="center">
  <a href="https://github.com/colorfy-software/zfy" target="_blank" rel="noopener noreferrer">
    🧸 Zfy
  </a>
</h1>

<h4 align="center">
  <strong>Useful helpers for state management in React with <a href="https://github.com/pmndrs/zustand" target="_blank" rel="noopener noreferrer">zustand</a>.</strong>
</h4>

<p align="center">
  <a href="https://github.com/colorfy-software/zfy/actions" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/colorfy-software/zfy/workflows/Test%20Suite/badge.svg?branch=main" alt="Current GitHub Actions build status" />
  </a>
  <a href="https://www.npmjs.org/package/@colorfy-software/zfy" target="_blank" rel="noopener noreferrer">
    <img src="https://badge.fury.io/js/%40colorfy-software%2Fzfy.svg" alt="Current npm package version" />
  </a>
  <a href="https://www.npmjs.org/package/@colorfy-software/zfy" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/dm/@colorfy-software/zfy.svg?maxAge=2592000" alt="Monthly npm downloads" />
  </a>
  <a href="https://colorfy-software.gitbook.io/@colorfy-software/zfy/contributing" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

# 💫 Acknowledgments

As you can imagine: major thanks to [the team of contributors behind **zustand**](https://github.com/pmndrs/zustand/graphs/contributors) for such an amazing library!

Zfy also exists thanks to [the folks working on **Immer**](https://github.com/immerjs/immer/graphs/contributors) who
made it so easy to deal with immutability.

# 🌺 Features

* Fully typed with TypeScript
* Harmonized access/update API 
* Logger & persistence middlewares provided out-of-the-box
* Easy-to-use persist gate component & rehydration hook
* Support for lazy and eager store rehydration
* Persistence compatible with any storage library
* Simple API for store creation with custom middlewares

# 🏗️ Installation

Install the library & its dependencies:

```sh
yarn add @colorfy-software/zfy zustand immer
```

# 💻 Usage

```tsx
import {
  initZfy,
  createStore,
  useRehydrate,
  PersistGate,
} from "@colorfy-software/zfy";
```


### [`initZfy(config)`](https://github.com/colorfy-software/zfy/blob/main/src/core/init-zfy.ts)

<details>
  <summary>Read section</summary>

  `initZfy()` is the function that configures the library. You should call it as early as possible in your code, in your
  root `index.ts/js` file for example.

  **Example:**

  ```tsx
  // index.ts
  import { initZfy, ZfyConfigType } from '@colorfy-software/zfy'
  import AsyncStorage from '@react-native-async-storage/async-storage'

  const config: ZfyConfigType = {
    enableLogging: true,
    storage: AsyncStorage,
    persistKey: 'myAppName',
  }

  initZfy(config)
  
  // ...
  ```

  Check [ZfyConfigType](https://github.com/colorfy-software/zfy/blob/main/src/core/init-zfy.ts) to see all the
  supported configuration options.

  **Notes:**
  
  `storage` only needs your persistent storage solution to provide `getItem()` & `setItem()` functions, wether they are Promises or not. If it doesn't, you can simply implement it yourself. Eg: 

  ```tsx
  storage: {
    setItem: (key, data) => realm.write(/* whatever you want to do here */)
  }
  ```


</details>

### [`createStore(name, data, options)`](https://github.com/colorfy-software/zfy/blob/main/src/core/create-store.ts)

<details>
  <summary>Read section</summary>

  `createStore()`, you guessed it, is the function that creates a zustand store. It only expects the store **name** & its
  default **data** but you can also provide some **options**. 
  
  That's where you can enable the middlewares Zfy provides out-of-the-box, like [`persist`](https://github.com/colorfy-software/zfy/blob/main/src/internals/persist-middleware.ts) or [`logger`](https://github.com/colorfy-software/zfy/blob/main/src/internals/logger-middleware.ts), or provide your own via the **customMiddlewares** option.
  
  ⚠️ _Zfy puts a special twist on how the resulting stores can be used, which is explained in the [Using a Zfy store](#using-a-zfy-store) section._
  

  **Example:**

  ```tsx
  // src/stores/user-store.ts
  import { createStore } from '@colorfy-software/zfy'

  import type { UserType, StoresDataType } from '../types'

  export const initialState: UserType = {
    id: '',
    likes: 0,
  }

  export default createStore<StoresDataType, 'user'>('user', initialState, {
    log: true,
    persist: { lazyRehydration: true },
  })
  ```

  Check [CreateStoreOptionsType](https://github.com/colorfy-software/zfy/blob/main/src/types.ts) to see all the
  supported options.

</details>

### [`useRehydrate(stores)`](https://github.com/colorfy-software/zfy/blob/main/src/core/use-rehydrate.ts)

<details>
  <summary>Read section</summary>

  `useRehydrate()` is a React hook that rehydrates all the persisted stores you provide to it and returns `true` once
  that's done.

  **Example:**

  ```tsx
  // src/App.tsx
  import { useEffect } from 'react'
  import { useRehydrate } from '@colorfy-software/zfy'
  import SplashScreen from 'my-splash-screen-library'

  import Navigation from './navigation'

  import user from './stores/user-store.ts'
  import settings from './stores/settings-store.ts'

  
  export default (): JSX.Element => {
    const isRehydrated = useRehydrate({ user, settings })

    useEffect(() => {
      if (isRehydrated) SplashScreen.hide()
    }, [isRehydrated])

    return <Navigation />
  }
  ```

  **Notes:**
  
  * Each key of the `stores` object you passed to `useRehydrate()` has to match the `name` argument you provided to `createStore()` when creating its store. Without this, rehydration will not happen as `useRehydrate()` won't be able to tell which store you're providing.

  * It's also very important here that: **you do not try to export all the stores from single file before importing them to use in another!**
  
  Let's assume we have: 

  ```ts
  // src/stores/index.ts

  import user from './user-store.ts'
  import settings from './settings-store.ts'

  export default { user, settings }
  ```
  
  if we were to write the following for instance:

  ```tsx
  // src/App.tsx
  import { useRehydrate } from '@colorfy-software/zfy'

  import stores from './stores'
  
  export default (): JSX.Element => {
    const isRehydrated = useRehydrate(stores)

    // ...
  }
  ```

  We could end up in situations were, by the time `useRehydrate()` is trying to access the `user` store for instance, it
  could still be `undefined` as: [the store wouldn't have been created yet](https://github.com/pmndrs/zustand/issues/116). 

  That's why we highly recommend that you directly import stores from the file were you created them, before providing
  them to `useRehydrate()`.
</details>

### [`<PersistGate stores={stores} loader={<Loader />} />`](https://github.com/colorfy-software/zfy/blob/main/src/core/PersistGate.tsx)

<details>
  <summary>Read section</summary>

  `<PersistGate />` is the component equivalent of `useRehydrate()` (that it still uses under the hood). You can use it to display a loader in your app while your stores are being rehydrated.
  
  **Example:**

  ```tsx
  // src/App.tsx
  import { useEffect } from 'react'
  import { PersistGate } from '@colorfy-software/zfy'

  import Loader from './Loader'
  import Navigation from './navigation'

  import user from './stores/user-store.ts'
  import settings from './stores/settings-store.ts'

  
  export default (): JSX.Element => (
    <PersistGate stores={{ user, settings }} loader={<Loader/>}>
      <Navigation />
    </PersistGate>
  )
  ```

  **Notes:**

  ⚠️ The same warning notes as with `useRehydrate()` apply here too.
</details>

### Using a Zfy store

We decided at colorfy to follow a specific set of rules that dictate how we use zustand stores. They trickled down into
some aspects of Zfy's API that we would like to explain here.

It's important to note that: **all the default zustand features are still working as you'd expect**, Zfy only aims at
enhancing not replacing them.

> ⚠️ So even though they're recommendations more than requirements, disregarding
the points covered below will prevent Zfy from showcasing its full potential (and will potentially lead to undesired bugs).


<details>
  <summary>Read section</summary>

  #### _How to access data?_

  As you may have realised by looking into
  [`createStore()`](https://github.com/colorfy-software/zfy/blob/main/src/core/create-store.ts): the data you want to use
  and display in your app
  is explicitly put inside `getState().data` and only there.

  So no matter which type of data you want to put inside a
  store: it  will always be available from `getState().data`, not the top level `getState()`.

  This might sound quite restrictive or overdoing it at first but, such approach helped us tremendously by simplifying and harmonizing how stores are created and used throughout the entire codebase. It also allowed us to implement rehydration in
  a more flexible and scalable way.

  That's why:

  > **Any
  store created with Zfy always exposes the same 4 elements from the `getState()` object**: **`data`**, **`rehydrate()`**,
  **`update()`** & **`reset()`**.

  *If you're using persistence with lazy rehydration explicitly, `isRehydrated` is added as the 5th one but is mainly
  used by Zfy rehydration tools.*

  By  this logic, accessing your data will always look the
  same. Eg:

  ```tsx
  // src/MyRootComponent.tsx
  import shallow from 'zustand/shallow'

  import userStore from './stores/user-store'
  import settingsStore from './stores/settings-store'

  const MyRootComponent = (): JSX.Element => {
    const appLanguage = settingsStore(({ data }) => data.language)
    const [firstName, lastName] = userStore(({ data }) => [data.firstName, data.lastName], shallow)

    // ...
  }
  ```

  If you're outside of React, you can still switch to the vanilla API. Eg:

  ```ts
  import messagesStore from './stores/messages-store'

  const amountOfUnreadMessages = messagesStore.getState().data.unread.length
  ```

  Now that we've covered how to access data with Zfy, you may ask:

  #### _How to update data?_

  As we briefly saw earlier, Zfy exposes 3 methods for updating a store, `rehydrate()`, `update()` & `reset()`, with
  each having a specific use case you could guess by their name:

  * **`rehydrate()`** is the method you will probably use the least as it's primarily meant for Zfy itself. If you
  enable persistence when creating a store: that's the
  method the library will call to properly rehydrate it when you're using `useRehydrate()` or `<PersistGate />`.
  But for it to work as expected, as explained in the next subsection, Zfy expects you to update your data solely via `update()`, not `setState()`! 

  * **`update()`** is the method you'll be using the most as that's how `data` is being changed. And thanks to our use
    of Immer, you won't have to think about actions, reducers, immutability or anything else. Just update your data,
    [even with mutable update patterns](https://immerjs.github.io/immer/update-patterns/), Immer will take care of the
    rest. Eg:

    Using from outside React:

    ```js
    // src/core.js
    import Auth from 'my-auth-provider'

    import Api from '../api'
    import userStore from '../stores/user-store'
    import messagesStore from '../stores/messages-store'

    const updateUser = userStore.getState().update
    const updateMessages = messagesStore.getState().update

    export default {
      user: { 
        login: async (email, password) => new Promise((resolve, reject) => {
          try { 
            const userData = await Auth.login(email, password)

            updateUser((user) => {
              user.data = userData
            })

            resolve(userData)
          } catch (error) {
            reject(error)
          }
        })
      },

      messages: {
        fetchInbox: async () => new Promise((resolve, reject) => {
          try {
            if (!(await Auth.isLoggedIn())) return resolve(messagesStore.getState().data.inbox)

            const inboxMessages = await Api.fetchInbox()

            updateMessages((messages) => {
              messages.data.inbox = inboxMessages
            })

            resolve(inboxMessages)
          } catch (error) {
            reject(error)
          }
        }),

        markAsRead: async (messageId) => new Promise((resolve, reject) => {
          try { 
            if (!(await Auth.isLoggedIn())) return resolve(false)

            await Api.markMessageAsRead(messageId)

            updateMessages((messages) => {
              const index = messages.data.inbox.findIndex(item => item.id === messageId)

              if (index !== -1) {
                messages.data.read.unshift({ ...messages.data.inbox[index], readAt: date.now() })
                messages.data.inbox.splice(index, 1)
              }
            })

            resolve(true)
          } catch (error) {
            reject(error)
          }
        })
      }
    }
    ```

    Using from within React works the same:

    ```tsx
    // src/screens/Login.tsx
    import core from '../core'
    import navigation from '../navigation'
    import appInfoStore from '../stores/app-info-store'

    const updateAppInfo = appInfoStore.getState().update

    const Login = (): JSX.Element => {
     const onPressLogin = async (email, password) => {
      try {
        // ...
        await core.user.login(email, password)

        updateAppInfo((appInfo) => {
          appInfo.data.lastLoginAt = Date.now()
        })

        await core.messages.fetchInbox()

        navigation.to('Home')
      } catch (error) {
        // handle error
      } finally {
        // ...
      }
     }

     // ...
    }

    export default Login
    ```

    Note that if you've enabled the provided persistence middleware on a store, **`update()` will automatically take care of
    saving `data` in a way that will allow `rehydrate()` to work without you having to do anything**. That's why:
  > ⚠️ For rehydration to work as expected, you should never use `setState()` but only `getState().update()`.

  * **`reset()`** finally, is your go-to method when you simply want to reset your store to its initial default data,
    useful for when your users are logging out for instance:

    ```js
    // src/core.js
    import Auth from 'my-auth-provider'

    import userStore from '../stores/user-store'

    const resetUser = userStore.getState().reset

    export default {
      user: { 
        logout: async (email, password) => new Promise((resolve, reject) => {
          try { 
            await Auth.logout()
            resetUser()
            resolve(true)
          } catch (error) {
            reject(error)
          }
        })
      },
    }
    ```

    ```tsx
    // src/screens/Profile.tsx
    import core from '../core'
    import navigation from '../navigation'

    const Profile = (): JSX.Element => {
     const onPressLogout = async () => {
      try {
        // ...
        await core.user.logout()
        navigation.reset('Login')
      } catch (error) {
        // handle error
      } finally {
        // ...
      }
     }

     // ...
    }

    export default Profile
    ```
</details>

# 🤝 Contributing

This library is a very opinionated approach to using zustand that the team uses at colorfy.

**Therefore, we won't necessarily consider requests that do not align with our goals/vision/use cases for Zfy**.

However, feel free to voice your opinions if need be: our position might change!

You can also consider doing so [_from the inside_](https://colorfy.me/jobs/) 👀…

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

# 📰 License

MIT
