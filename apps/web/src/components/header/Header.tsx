import { PageLayout } from '@bloxifi/ui'
import React from 'react'

import { ConnectWalletButton } from '../connector/ConnectWalletButton'

export const Header = () => {
  return (
    <PageLayout.Header
      navigationItems={[
        { to: '/', label: 'Dashboard' },
        { to: '/borrow', label: 'Deposit & Borrow' },
        { to: '/information', label: 'More information' },
        { to: '/transfer', label: 'Token Transfer' },
      ]}
    >
      <ConnectWalletButton />
    </PageLayout.Header>
  )
}
