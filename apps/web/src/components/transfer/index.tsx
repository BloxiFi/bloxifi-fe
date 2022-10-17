import React from 'react'
import { GridLayout, StackLayout } from '@bloxifi/ui'

import { ConnectionStatus } from '../borrow/ConnectionStatus'

import TransferAsset from './TransferAsset'

import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'
import { Web3Container } from '@/containers/Web3Container'

const TokenTransfer = () => {
  const {
    state: {
      isConnected,
      loading: connectionLoading,
      isSupportedNetwork,
      isMetamaskInstalled,
    },
  } = Web3Container.useContainer()

  return isMetamaskInstalled &&
    isSupportedNetwork &&
    !connectionLoading &&
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
    <ConnectionStatus />
  )
}
export default TokenTransfer
