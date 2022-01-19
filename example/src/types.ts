export type StoresNameType = keyof StoresDataType

/**********************************
 *
 *              APP
 *
 **********************************/

export interface AppType {
  pushPermissions?: boolean
  isFirstDisplayOfHome?: boolean
  navigationState: 'auth' | 'app'
}

/**********************************
 *
 *             USER
 *
 **********************************/

export interface UserType {
  firstName?: string
  lastName?: string
  UID?: string
}

export interface StoresDataType {
  app: AppType
  user: UserType
}
