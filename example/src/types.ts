/**********************************
 *
 *              APP
 *
 **********************************/

export interface AppType {
  backgroundColor: string
}

/**********************************
 *
 *             USER
 *
 **********************************/

export interface UserType {
  name: string
}

export interface StoresDataType {
  app: AppType
  user: UserType
}
