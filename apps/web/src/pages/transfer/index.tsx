import React from 'react'
import {
  CoverLayout,
  GridLayout,
  Loader,
  PageLayout,
  StackLayout,
} from '@bloxifi/ui'

import { Web3Container } from '@/containers/Web3Container'
import { WalletContainer } from '@/containers/WalletContainer'
import { NotConnected } from '@/components/borrow/NotConnected'
import { CrossChainAssetTable } from '@/components/transfer/table/CrossChainAssetTable'

const TokenTransferPage = () => {
  const {
    state: { isConnected, loading: connectionLoading },
  } = Web3Container.useContainer()
  const {
    state: { error },
  } = WalletContainer.useContainer()

  if (connectionLoading) {
    return (
      <CoverLayout>
        <Loader />
      </CoverLayout>
    )
  }

  if (error && isConnected) {
    return <>Something went wrong</> //TODO DISPLAYING ERROR MESSAGES
  }

  return (
    <PageLayout.Section>
      {isConnected ? (
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
        <NotConnected />
      )}
    </PageLayout.Section>
  )
}
export default TokenTransferPage
