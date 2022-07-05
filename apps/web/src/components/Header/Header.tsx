import { PageLayout } from '@bloxifi/ui'
import React from 'react'

import { ConnectWalletButton } from '../WalletConnection/ConnectWalletButton'

export const Header = () => {
  return (
    <PageLayout.Header
      navigationItems={[
        { to: '/', label: 'Dashboard' },
        { to: '/staking', label: 'Staking' },
        { to: '/deposit', label: 'Deposit & Borrow' },
      ]}
    >
      <ConnectWalletButton />
    </PageLayout.Header>
  )
}
