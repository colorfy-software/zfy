import type {
  ZfyMiddlewareType,
  CreateStoreConfigType,
  CreateStoreOptionsType,
} from '../../types'

import logger from './logger-middleware'
import persist from './persist-middleware'
import subscribe from './subscribe-middleware'

import { validateOptionsForPersistence } from '../validations'

const createMiddleware = <StoreDataType extends unknown>(
  storeName: string,
  options?: CreateStoreOptionsType<StoreDataType>
) => {
  const pipe =
    (...fns: ZfyMiddlewareType<StoreDataType>[]) =>
    (
      n: string,
      s: CreateStoreConfigType<StoreDataType>
    ): CreateStoreConfigType<StoreDataType> =>
      fns.length ? fns.reduce((c, f) => f(n, c, options), s) : s

  let middlewares: ZfyMiddlewareType<StoreDataType>[] = []

  if (options?.log) {
    middlewares = [...middlewares, logger]
  }
  if (options?.subscribe) {
    middlewares = [
      ...middlewares,
      subscribe as unknown as ZfyMiddlewareType<StoreDataType>,
    ]
  }
  if (options && 'persist' in options) {
    validateOptionsForPersistence(storeName, options)
    middlewares = [
      ...middlewares,
      persist as unknown as ZfyMiddlewareType<StoreDataType>,
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
