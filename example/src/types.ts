import type { CreateStoreType } from '@colorfy-software/zfy'

export type CounterType = number

export interface UserType {
  ID: string
  totalCounter: number
}

export interface StoresType {
  counter: CreateStoreType<CounterType>
  user: CreateStoreType<UserType>
}

export interface StoresDataType {
  counter: CounterType
  user: UserType
}
