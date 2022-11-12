import React, { ReactNode } from 'react'

import ConditionalWrapper from '../general/ConditionalWrapper'

import { Web3Container } from '@/containers/Web3Container'
import { Web3PolkadotContainer } from '@/containers/Web3PolkadotContainer'

export const PrivateRoute = ({
  component: Component,
  isPolkadotConnRequired,
  ...rest
}) => {
  return (
    <ConditionalWrapper
      condition={isPolkadotConnRequired}
      wrapper={(children: ReactNode) => (
        <Web3PolkadotContainer.Provider>
          {children}
        </Web3PolkadotContainer.Provider>
      )}
    >
      <Web3Container.Provider>
        <Component {...rest} />
      </Web3Container.Provider>
    </ConditionalWrapper>
  )
}
