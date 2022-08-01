import {
  BoxLayout,
  Button,
  ColumnData,
  ColumnLayout,
  Icon,
  Table,
  Text,
  Toggle,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { FormattedNumber } from '../FormattedNumber'

import { DepositTitleBox } from './DepositTitleBox'

import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'

export const YourDepositsTable: FunctionComponent = () => {
  const {
    state: { userReserves },
  } = WalletContainer.useContainer()
  const formatedData = userReserves.filter(
    (reserve: UserReserveData) => reserve.currentATokenBalance !== 0,
  )
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
      Cell: ({ data: { currentATokenBalance } }) => (
        <Text type="body 3" as="span">
          <FormattedNumber value={currentATokenBalance} />
        </Text>
      ),
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { supplyAPY } }) => (
        <FormattedNumber value={supplyAPY} percent />
      ),
      alignText: 'left',
    },

    collateral: {
      header: 'Collateral',
      Cell: ({ data: { usageAsCollateralEnabledOnUser } }) => (
        <Toggle checked={usageAsCollateralEnabledOnUser} />
      ),
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
  } as Record<string, ColumnData<UserReserveData>>

  return (
    <Table
      columns={columns}
      data={formatedData}
      noDataMessage="Nothing deposited yet"
      titleComponent={<DepositTitleBox isEmpty={formatedData.length === 0} />}
      footer={<BoxLayout gap={1} />}
    />
  )
}
