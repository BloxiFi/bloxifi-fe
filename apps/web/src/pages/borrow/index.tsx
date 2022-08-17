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
import { AvailableToBorrowTable } from '@/components/borrow/table/AvailableToBorrowTable'
import { AvaliableToDepositTable } from '@/components/borrow/table/AvaliableToDepositTable'
import { YourDepositsTable } from '@/components/borrow/table/YourDepositsTable'
import { YourBorrowsTable } from '@/components/borrow/table/YourBorrowsTable'

const BorrowPage = () => {
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
              <YourDepositsTable />
              <AvaliableToDepositTable />
            </StackLayout>
          </GridLayout.Column>
          <GridLayout.Column span={6}>
            <StackLayout gap={1.5}>
              <YourBorrowsTable />
              <AvailableToBorrowTable />
            </StackLayout>
          </GridLayout.Column>
        </GridLayout>
      ) : (
        <NotConnected />
      )}
    </PageLayout.Section>
  )
}
export default BorrowPage
