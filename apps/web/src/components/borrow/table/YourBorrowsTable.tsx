//TODO COMPLETE FETCHING & DISPLAYING DATA
import {
  BoxLayout,
  Button,
  ColumnData,
  ColumnLayout,
  Icon,
  Table,
  Text,
  TruncatedText,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'
import { numberToPercentage } from '@bloxifi/core'

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
  const userReservesWithDept = userReserves.filter(
    (reserve: UserReserveData) => reserve.currentTotalDebt !== 0,
  )
  //Calculate total borrowed balance compared to total available borrow for the current user (in percentage)
  const currentBorrowedValue = numberToPercentage(
    totalDebtETH / (totalDebtETH + availableBorrowsETH),
  )

  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { symbol, icon } }: any) => (
        <ColumnLayout>
          <Icon name={icon} size={25} />
          <TruncatedText>
            <Text type="heading 3" as="span">
              {symbol}
            </Text>
          </TruncatedText>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { currentTotalDebt } }) => (
        <TruncatedText>
          <FormattedNumber value={currentTotalDebt} />
        </TruncatedText>
      ),
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { variableBorrowAPY } }) => (
        <FormattedNumber value={variableBorrowAPY} percent />
      ),
      alignText: 'left',
      width: 100,
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
      data={userReservesWithDept}
      noDataMessage="Nothing borrowed yet"
      titleComponent={
        <BorrowTitleBox
          isEmpty={userReservesWithDept.length === 0}
          currentBorrowedValue={Number(currentBorrowedValue.toFixed(2))}
        />
      }
      footer={<BoxLayout gap={1} />}
    />
  )
}
