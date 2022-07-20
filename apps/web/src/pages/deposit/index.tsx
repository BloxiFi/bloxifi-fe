import { StackLayout } from '@bloxifi/ui'
import React from 'react'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'

import { Web3Container } from '@/containers/Web3Container'
import { WalletContainer } from '@/containers/WalletContainer'
import { NotConnected } from '@/components/DepositAndBorrow/NotConnected'
import { AssetsToBorrowTable } from '@/components/DepositAndBorrow/Borrow/AssetsToBorrowTable'
import { AssetsToDepositTable } from '@/components/DepositAndBorrow/Deposit/AssetsToDepositTable'

const DepositPage = () => {
  const {
    state: { isConnected, loading: connectionLoading },
  } = Web3Container.useContainer()
  const {
    state: { loading: reservesLoading, error },
  } = WalletContainer.useContainer()

  if (reservesLoading || connectionLoading) {
    return <>loading...</> //TODO LOADER COMPONENT loader={<Loader loaderSize={size} />}
  }

  if (error && isConnected) {
    return <>Something went wrong</> //TODO DISPLAYING ERROR MESSAGES
  }

  return isConnected ? (
    <GridLayout>
      <GridLayout.Column span={6}>
        <StackLayout gap={1.5}>
          {/**
           * //TODO COMPLETE FETCHING & DISPLAYING CURRENT DEPOSIT DATA
           * <CurrentDepositTable />
           */}
          <AssetsToDepositTable />
        </StackLayout>
      </GridLayout.Column>
      <GridLayout.Column span={6}>
        <StackLayout gap={1.5}>
          {/**
           * //TODO COMPLETE FETCHING & DISPLAYING CURRENT BORROW DATA
           * <CurrentBorrowTable />
           */}
          <AssetsToBorrowTable />
        </StackLayout>
      </GridLayout.Column>
    </GridLayout>
  ) : (
    <NotConnected />
  )
}
export default DepositPage
