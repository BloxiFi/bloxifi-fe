import React from 'react'
import { GridLayout, PageLayout, StackLayout } from '@bloxifi/ui'

import { Web3Container } from '@/containers/Web3Container'
import { WalletContainer } from '@/containers/WalletContainer'
import { ConnectionStatus } from '@/components/borrow/ConnectionStatus'
import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'
import { Web3PolkadotContainer } from '@/containers/Web3PolkadotContainer'
import TransferAsset from '@/components/transfer/TransferAsset'

const TokenTransferPage = () => {
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
  const {
    state: { error },
  } = WalletContainer.useContainer()

  return (
    <Web3PolkadotContainer.Provider>
      <PageLayout.Section>
        {isMetamaskInstalled &&
        isSupportedNetwork &&
        !connectionLoading &&
        !error &&
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
    </Web3PolkadotContainer.Provider>
  )
}
export default TokenTransferPage
