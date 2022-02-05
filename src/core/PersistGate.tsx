import React, { useEffect, memo } from 'react'

import type { CreateStoreType } from '../types'

import useRehydrate from './use-rehydrate'
import { validatePersistGate } from '../internals/validations'

interface PropsType<StoresType> {
  children: JSX.Element | JSX.Element[] | (() => JSX.Element)
  loader?: JSX.Element | (() => JSX.Element)
  stores: StoresType
}

/**
 * Component that renders a loader while all the provided persisted stores get rehydrated.
 * @prop stores - Array containing all the zustand stores to rehydrate.
 * @prop children -  React element to render once rehydration is completed.
 * @prop loader - Optional. Loader component to display.
 */
const PersistGate = <StoresType extends CreateStoreType<any, any>[]>({
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

export default memo(PersistGate)
