import React, { FunctionComponent } from 'react'
import { Button, CellProps, ColumnData, Table, Text } from '@bloxifi/ui'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'

import { WalletBalance, WalletContainer } from '@/containers/WalletContainer'

export const AvaliableToDepositTable: FunctionComponent = () => {
  const {
    state: { reserves },
  } = WalletContainer.useContainer()

  const columns = {
    assets: {
      header: 'Assets',
      //TODO@Kiki I changed symbol to "name" because that was the appropriate type (but not sure that this is correct) please check this.
      Cell: ({ data: { name, icon, fullName } }) => (
        <AssetName symbol={name} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    walletBalance: {
      header: 'Wallet balance',
      Cell: ({ data: { balance } }) => {
        return <FormattedNumber value={parseFloat(balance)} />
      },
      alignText: 'center',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { supplyAPY } }) => (
        <Text type="body 3" as="span">
          <FormattedNumber value={supplyAPY} percent />
        </Text>
      ),
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: ({ data: { balance } }: CellProps) => (
        <Button
          disabled={!balance}
          appearance="secondary"
          variant="medium"
          size="small"
        >
          Deposit
        </Button>
      ),
      width: 100,
    },
  } as Record<string, ColumnData<WalletBalance>>

  return (
    <Table
      columns={columns}
      data={reserves}
      titleComponent="Assets to deposit"
      columnSpacing
    />
  )
}
