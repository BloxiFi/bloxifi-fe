import React, { FunctionComponent } from 'react'
import { Button, ColumnData, Table } from '@bloxifi/ui'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'

import { WalletBalance, WalletContainer } from '@/containers/WalletContainer'

export const AvailableToBorrowTable: FunctionComponent = () => {
  const {
    state: { reserves },
  } = WalletContainer.useContainer()

  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { symbol, icon, fullName } }: any) => (
        <AssetName symbol={symbol} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    walletBalance: {
      header: 'Wallet balance',
      Cell: ({ data: { balance } }: any) => {
        return <FormattedNumber value={balance} />
      },
      alignText: 'center',
    },
    APY: {
      header: 'APY',
      Cell: () => <FormattedNumber value={0.0568} percent />,
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: () => (
        <Button appearance="secondary" variant="medium" size="small">
          Borrow
        </Button>
      ),
      width: 100,
    },
  } as Record<string, ColumnData<WalletBalance>>

  return (
    <Table
      columns={columns}
      data={reserves}
      titleComponent="Assets to borrow"
      columnSpacing
    />
  )
}
