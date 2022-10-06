import { ColumnLayout, PageLayout } from '@bloxifi/ui'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { ConnectPolkadotButton } from '../connector/ConnectPolkadotButton'
import { ConnectWalletButton } from '../connector/ConnectWalletButton'

export const Header = ({ isPolkadotRoute }: any) => {
  const path = useLocation()
  const isCurrentPolkadotRoute = isPolkadotRoute(`${path.pathname}/`)

  return (
    <PageLayout.Header
      navigationItems={[
        { to: '/', label: 'Dashboard' },
        { to: '/borrow', label: 'Deposit & Borrow' },
        { to: '/information', label: 'More information' },
        { to: '/transfer', label: 'Token Transfer' },
      ]}
    >
      <ColumnLayout>
        <ConnectWalletButton />
        {isCurrentPolkadotRoute && <ConnectPolkadotButton />}
      </ColumnLayout>
    </PageLayout.Header>
  )
}
