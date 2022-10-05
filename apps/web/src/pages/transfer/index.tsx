import React from 'react'
import { GridLayout, PageLayout, StackLayout } from '@bloxifi/ui'

import { Web3Container } from '@/containers/Web3Container'
import { WalletContainer } from '@/containers/WalletContainer'
import { ConnectionStatus } from '@/components/borrow/ConnectionStatus'
import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'
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
    state: { error },
  } = WalletContainer.useContainer()

  return (
    <PageLayout.Section>
      {isMetamaskInstalled &&
      isSupportedNetwork &&
      !connectionLoading &&
      !error &&
      isConnected ? (
        <GridLayout>
          <GridLayout.Column span={6}>
            <StackLayout gap={1.5}>
              <TransferAsset />
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
export default TokenTransferPage
