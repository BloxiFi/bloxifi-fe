import React, { FunctionComponent } from 'react'
import { Button, CellProps, Table, Text } from '@bloxifi/ui'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'

import { WalletContainer } from '@/containers/WalletContainer'

export const AssetsToDepositTable: FunctionComponent = () => {
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
      Cell: ({ data: { supplyAPY } }: any) => (
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
  }

  return (
    <Table
      columns={columns}
      data={reserves}
      titleComponent="Assets to deposit"
      columnSpacing
    />
  )
}
