import { StackLayout } from '@bloxifi/ui'
import React from 'react'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'

import { Web3Container } from '@/containers/Web3Container'
import { WalletContainer } from '@/containers/WalletContainer'
import { NotConnected } from '@/components/DepositAndBorrow/NotConnected'
import { CurrentBorrowTable } from '@/components/DepositAndBorrow/Borrow/CurrentBorrowTable'
import { AssetsToBorrowTable } from '@/components/DepositAndBorrow/Borrow/AssetsToBorrowTable'
import { CurrentDepositTable } from '@/components/DepositAndBorrow/Deposit/CurrentDepositTable'
import { AssetsToDepositTable } from '@/components/DepositAndBorrow/Deposit/AssetsToDepositTable'

const DepositPage = () => {
  const {
    state: { isConnected, loading: connectionLoading },
  } = Web3Container.useContainer()
  const {
    state: { loading: reservesLoading, error },
  } = WalletContainer.useContainer()

  if (reservesLoading || connectionLoading) {
    return <>loading...</>
  }

  if (error && isConnected) {
    return <>Something went wrong</>
  }

  return isConnected ? (
    <GridLayout>
      <GridLayout.Column span={6}>
        <StackLayout gap={1.5}>
          <CurrentDepositTable />
          <AssetsToDepositTable />
        </StackLayout>
      </GridLayout.Column>
      <GridLayout.Column span={6}>
        <StackLayout gap={1.5}>
          <CurrentBorrowTable />
          <AssetsToBorrowTable />
        </StackLayout>
      </GridLayout.Column>
    </GridLayout>
  ) : (
    <NotConnected />
  )
}
export default DepositPage
