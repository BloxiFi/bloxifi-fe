import React from 'react'
import { GridLayout, StackLayout } from '@bloxifi/ui'

import TransferAsset from './TransferAsset'

import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'

const TokenTransfer = () => {
  return (
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
  )
}
export default TokenTransfer
