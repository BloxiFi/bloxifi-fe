import React from 'react'
import { CoverLayout, GridLayout, Loader, StackLayout } from '@bloxifi/ui'

import { ConnectionStatus } from '../borrow/ConnectionStatus'

import TransferAsset from './TransferAsset'

import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'
import { Web3Container } from '@/containers/Web3Container'
import { useWalletBalance } from '@bloxifi/core'

const TokenTransfer = () => {
  const {
    state: {
      currentAccount,
      isConnected,
      loading: connectionLoading,
      isMetamaskInstalled,
      chainId,
    },
  } = Web3Container.useContainer()

  const { balances, isLoading } = useWalletBalance({
    currentAccount,
    currentChainId: chainId,
  })
  if (isLoading) {
    return (
      <CoverLayout>
        <Loader />
      </CoverLayout>
    )
  }

  //TODO Check for supported networks
  return isMetamaskInstalled && !connectionLoading && isConnected ? (
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
