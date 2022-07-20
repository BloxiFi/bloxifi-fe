import React, { FunctionComponent } from 'react'
import {
  Button,
  CellProps,
  ColumnLayout,
  Icon,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'

import { WalletContainer } from '@/containers/WalletContainer'

export const AssetsToDepositTable: FunctionComponent = () => {
  const {
    state: { reserves },
  } = WalletContainer.useContainer()

  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { symbol, icon, fullName } }: any) => (
        <ColumnLayout>
          <Icon name={icon} size={40} />
          <StackLayout>
            <Text type="heading 3" as="span">
              {fullName}
            </Text>
            <Text type="body 1" as="span">
              {symbol}
            </Text>
          </StackLayout>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    walletBalance: {
      header: 'Wallet balance',
      Cell: ({ data: { balance } }: CellProps) => {
        return (
          <Text type="body 3" as="span">
            {balance}
          </Text>
        )
      },
      alignText: 'center',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { liquidityRate } }: CellProps) => (
        <Text type="body 3" as="span">
          1.22%
        </Text>
      ),
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: () => (
        <Button appearance="secondary" variant="medium" size="small">
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
