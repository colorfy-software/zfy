import React, { useEffect } from 'react'

import type { CreateStoreType } from '../types'

import useRehydrate from './use-rehydrate'
import { validatePersistGate } from '../internals/validation'

interface PropsType<StoresType> {
  children: JSX.Element | JSX.Element[] | (() => JSX.Element)
  loader?: JSX.Element | (() => JSX.Element)
  stores: StoresType
}

/**
 * Component that renders a loader while all the provided persisted stores get rehydrated.
 * @prop stores - `Record<string, CreateStoreType<any>>`— Object containing all the zustand stores to rehydrate.
 * @prop children - `JSX.Element | JSX.Element[]`— React element to render once rehydration is completed.
 * @prop loader - `JSX.Element`— Optional. Loader component to display.
 */
const PersistGate = <StoresType extends Record<string, CreateStoreType<any>>>({
  stores,
  loader,
  children,
}: PropsType<StoresType>): JSX.Element | null => {
  useEffect(() => {
    validatePersistGate(stores)
  }, [stores])

  const isRehydrated = useRehydrate<StoresType>(stores)

  return (
    <>
      {isRehydrated
        ? typeof children === 'function'
          ? children()
          : children
        : typeof loader === 'function'
        ? loader()
        : loader || null}
    </>
  )
}

export default PersistGate
