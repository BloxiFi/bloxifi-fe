import React from 'react'
import { CoverLayout, GridLayout, Loader, StackLayout } from '@bloxifi/ui'
import { useWalletBalance } from '@bloxifi/core'

import { ConnectionStatus } from '../borrow/ConnectionStatus'

import TransferAsset from './TransferAsset'

import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'
import { Web3Container } from '@/containers/Web3Container'

const TokenTransfer = () => {
  const {
    state: {
      currentAccount,
      isConnected,
      loading: connectionLoading,
      isMetamaskInstalled,
      isSupportedNetwork,
      chainId,
      network,
    },
  } = Web3Container.useContainer()

  const { balances, isLoading } = useWalletBalance({
    currentAccount,
    currentChainId: chainId,
    currentNetwork: network,
  })
  if (isLoading || connectionLoading) {
    return (
      <CoverLayout>
        <Loader />
      </CoverLayout>
    )
  }

  return isMetamaskInstalled && isSupportedNetwork && isConnected ? (
    <GridLayout>
      <GridLayout.Column span={6}>
        <StackLayout gap={1.5}>
          <TransferAsset />
        </StackLayout>
      </GridLayout.Column>
      <GridLayout.Column span={6}>
        <StackLayout gap={1.5}>
          <CrossChainAssetTable balances={balances} />
        </StackLayout>
      </GridLayout.Column>
    </GridLayout>
  ) : (
    <ConnectionStatus />
  )
}
export default TokenTransfer
