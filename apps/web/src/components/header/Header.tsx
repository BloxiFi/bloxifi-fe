import {
  ColumnLayout,
  PageLayout,
  HeaderLink,
  HeaderExternalLink,
  Button,
} from '@bloxifi/ui'
import { hasTokenTransfer, isPolkadotRoute } from '@bloxifi/core'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { ConnectPolkadotButton } from '../connector/ConnectPolkadotButton'
import { ConnectWalletButton } from '../connector/ConnectWalletButton'

const GITBOOK_URL = process.env.GITBOOK_URL

export const Header = () => {
  const path = useLocation()
  const isCurrentPolkadotRoute = isPolkadotRoute(`${path.pathname}/`)
  const initialNavigation = [
    <HeaderLink data-cy="Dashboard" key="/" to="/">
      Dashboard
    </HeaderLink>,
    <HeaderLink data-cy="Deposit &amp; Borrow" key="/borrow" to="/borrow">
      Deposit &amp; Borrow
    </HeaderLink>,
    <HeaderExternalLink
      data-cy="More information"
      key="/information"
      href={GITBOOK_URL}
      target="_blank"
    >
      More information
    </HeaderExternalLink>,
  ]
  const tokenTransfer = hasTokenTransfer
    ? [
        <HeaderLink data-cy="Token Transfer" key="/transfer" to="/transfer">
          Token Transfer
        </HeaderLink>,
      ]
    : []

  return (
    <PageLayout.Header
      navigationItems={[...initialNavigation, ...tokenTransfer]}
    >
      <ColumnLayout>
        <Button
          appearance="text"
          className="u-fit-content-width"
          variant="large"
          size="large"
          disabled
          color="red"
        >
          Beta Version
        </Button>
        <ConnectWalletButton />
        {isCurrentPolkadotRoute && <ConnectPolkadotButton />}
      </ColumnLayout>
    </PageLayout.Header>
  )
}
