import React from 'react'
import { GridLayout, PageLayout, StackLayout } from '@bloxifi/ui'

import { Web3Container } from '@/containers/Web3Container'
import { ConnectionStatus } from '@/components/borrow/ConnectionStatus'
import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'
import { Web3PolkadotContainer } from '@/containers/Web3PolkadotContainer'

const TokenTransfer = () => {
  const {
    state: {
      isConnected,
      loading: connectionLoading,
      isSupportedNetwork,
      isMetamaskInstalled,
    },
  } = Web3Container.useContainer()

  const {
    state: {
      isConnectedPolkadot,
      isSupportedNetworkPolkadot,
      isPolkadotEnabled,
    },
  } = Web3PolkadotContainer.useContainer()

  return (
    <PageLayout.Section>
      {isMetamaskInstalled &&
      isSupportedNetwork &&
      !connectionLoading &&
      isConnectedPolkadot &&
      isSupportedNetworkPolkadot &&
      isPolkadotEnabled &&
      isConnected ? (
        <GridLayout>
          <GridLayout.Column span={6}>
            <StackLayout gap={1.5}>
              <CrossChainAssetTable />
            </StackLayout>
          </GridLayout.Column>
          <GridLayout.Column span={6}>
            <StackLayout gap={1.5}>
              <CrossChainAssetTable />
            </StackLayout>
          </GridLayout.Column>
        </GridLayout>
      ) : (
        <GridLayout>
          <ConnectionStatus />
        </GridLayout>
      )}
    </PageLayout.Section>
  )
}
export default TokenTransfer
