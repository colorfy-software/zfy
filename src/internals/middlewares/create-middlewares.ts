import type {
  ZfyMiddlewareType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

import logger from './logger-middleware'
import persist from './persist-middleware'

import { validateOptionsForPersistence } from '../validations'

const createMiddleware = <
  StoresDataType extends Record<string, any>,
  StoreNameType extends keyof StoresDataType = keyof StoresDataType
>(
  storeName: StoreNameType,
  options?: CreateStoreOptionsType<StoresDataType, StoreNameType>
) => {
  const pipe =
    (...fns: ZfyMiddlewareType<StoresDataType, StoreNameType>[]) =>
    (
      n: StoreNameType,
      s: CreateStoreConfigType<StoresDataType, StoreNameType>
    ): CreateStoreConfigType<StoresDataType, StoreNameType> =>
      fns.length ? fns.reduce((c, f) => f(n, c, options), s) : s

  let middlewares: ZfyMiddlewareType<StoresDataType, StoreNameType>[] = []

  if (options?.log) {
    middlewares = [...middlewares, logger]
  }
  if (options && 'persist' in options) {
    validateOptionsForPersistence(storeName, options)
    middlewares = [
      ...middlewares,
      persist as unknown as ZfyMiddlewareType<StoresDataType, StoreNameType>,
    ]
  }
  if (
    options &&
    'customMiddlewares' in options &&
    options?.customMiddlewares?.length
  ) {
    middlewares = [...middlewares, ...options.customMiddlewares]
  }

  return pipe(...middlewares)
}

export default createMiddleware
