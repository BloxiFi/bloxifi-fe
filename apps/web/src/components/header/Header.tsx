import { ColumnLayout, PageLayout } from '@bloxifi/ui'
import { isPolkadotRoute } from '@bloxifi/core'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { ConnectPolkadotButton } from '../connector/ConnectPolkadotButton'
import { ConnectWalletButton } from '../connector/ConnectWalletButton'

const isTestNet = process.env.IS_TESTNET

export const Header = () => {
  const path = useLocation()
  const isCurrentPolkadotRoute = isPolkadotRoute(`${path.pathname}/`)
  const initialNavigation = [
    { to: '/', label: 'Dashboard' },
    { to: '/borrow', label: 'Deposit & Borrow' },
    { to: '/information', label: 'More information' },
  ]
  const tokenTransfer = isTestNet
    ? [{ to: '/transfer', label: 'Token Transfer' }]
    : []

  return (
    <PageLayout.Header
      navigationItems={[...initialNavigation, ...tokenTransfer]}
    >
      <ColumnLayout>
        <ConnectWalletButton />
        {isCurrentPolkadotRoute && <ConnectPolkadotButton />}
      </ColumnLayout>
    </PageLayout.Header>
  )
}
