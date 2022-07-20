import {
  BoxLayout,
  Button,
  CellProps,
  ColumnLayout,
  Icon,
  Table,
  Text,
  Toggle,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { DepositTitleBox } from './DepositTitleBox'

import { WalletContainer } from '@/containers/WalletContainer'

export const CurrentDepositTable: FunctionComponent = () => {
  const {
    state: { userReserves },
  } = WalletContainer.useContainer()

  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { symbol, icon } }: any) => (
        <ColumnLayout>
          <Icon name={icon} size={40} />
          <Text type="heading 3" as="span">
            {symbol}
          </Text>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { currentATokenBalance } }: CellProps) => (
        <Text type="body 3" as="span">
          {currentATokenBalance}
        </Text>
      ),
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { APY } }: CellProps) => <span>{APY}</span>,
      alignText: 'left',
    },

    collateral: {
      header: 'Collateral',
      Cell: () => <Toggle />,
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          className="u-full-width"
        >
          Withdraw
        </Button>
      ),
      width: 160,
    },
  }

  return (
    <Table
      columns={columns}
      data={userReserves}
      noDataMessage="Nothing deposited yet"
      titleComponent={<DepositTitleBox isEmpty={userReserves.length > 0} />}
      footer={<BoxLayout gap={1} />}
    />
  )
}
