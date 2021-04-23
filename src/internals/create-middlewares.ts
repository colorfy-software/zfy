import type {
  ZfyMiddlewareType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../types'
import logger from './logger-middleware'
import persist from './persist-middleware'

import { validateConfigForPersistence } from './validation'

const createMiddleware = <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
>(
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
) => {
  const pipe = (...fns: ZfyMiddlewareType<StoresDataType, StoreNameType>[]) => (
    n: StoreNameType,
    s: CreateStoreConfigType<StoresDataType[StoreNameType]>
  ): CreateStoreConfigType<StoresDataType[StoreNameType]> =>
    fns.length ? fns.reduce((c, f) => f(n, c), s) : s

  let middlewares: CreateStoreOptionsType<
    StoresDataType,
    StoreNameType
  >['customMiddlewares'] = []

  if (options?.log) {
    middlewares = [...middlewares, logger]
  }
  if (options?.persist) {
    validateConfigForPersistence()
    middlewares = [...middlewares, persist]
  }
  if (options?.customMiddlewares?.length) {
    middlewares = [...middlewares, ...options.customMiddlewares]
  }

  return pipe(...middlewares)
}

export default createMiddleware
