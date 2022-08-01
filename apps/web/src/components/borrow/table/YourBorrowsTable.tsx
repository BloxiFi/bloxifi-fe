//TODO COMPLETE FETCHING & DISPLAYING DATA
import {
  BoxLayout,
  Button,
  ColumnData,
  ColumnLayout,
  Icon,
  Table,
  Text,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { FormattedNumber } from '../FormattedNumber'

import { BorrowTitleBox } from './BorrowTitleBox'

import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'

export const YourBorrowsTable: FunctionComponent = () => {
  const {
    state: {
      userReserves,
      userAccountData: { totalDebtETH, availableBorrowsETH },
    },
  } = WalletContainer.useContainer()
  const formatedData = userReserves.filter(
    (reserve: UserReserveData) => reserve.currentTotalDebt !== 0,
  )
  //Calculate total borrowed balance compared to total available borrow for the current user (in percentage)
  const currentBorrowedValue =
    (totalDebtETH / (totalDebtETH + availableBorrowsETH)) * 100

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
      Cell: ({ data: { currentTotalDebt } }) => (
        <FormattedNumber value={currentTotalDebt} />
      ),
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { variableBorrowAPY } }) => (
        <FormattedNumber value={variableBorrowAPY} percent />
      ),
      alignText: 'left',
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
          Repay
        </Button>
      ),
      width: 160,
    },
  } as Record<string, ColumnData<UserReserveData>>

  return (
    <Table
      columns={columns}
      data={formatedData}
      noDataMessage="Nothing borrowed yet"
      titleComponent={
        <BorrowTitleBox
          isEmpty={formatedData.length === 0}
          currentBorrowedValue={Number(currentBorrowedValue.toFixed(2))}
        />
      }
      footer={<BoxLayout gap={1} />}
    />
  )
}
