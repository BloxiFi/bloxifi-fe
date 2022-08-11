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
import React, { FunctionComponent, useState } from 'react'
import { numberToPercentage } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'

import { FormattedNumber } from '../FormattedNumber'
import { RepayModal, RepayModalData } from '../modal/RepayModal'

import { BorrowTitleBox } from './BorrowTitleBox'

import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'

export const YourBorrowsTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: {
      userReserves,
      userAccountData: { totalDebtETH, availableBorrowsETH, healthFactor },
      loading,
    },
  } = WalletContainer.useContainer()
  const userReservesWithDept = userReserves.filter(
    (reserve: UserReserveData) => reserve.currentTotalDebt !== 0,
  )

  const [modalData, setModalData] = useState<RepayModalData>()

  const openModal = (data: RepayModalData) => {
    setModalData(data)
  }

  const closeModal = () => {
    setModalData(undefined)
    //TODO update balance
  }

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
      Cell: ({ data: { currentTotalDebt, symbol, underlyingAsset } }) => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          className="u-full-width"
          onClick={() =>
            openModal({
              currentTotalDebt,
              symbol,
              underlyingAsset,
            })
          }
        >
          Repay
        </Button>
      ),
      width: 160,
    },
  } as Record<string, ColumnData<UserReserveData>>

  return (
    <>
      <Table
        columns={columns}
        data={userReservesWithDept}
        noDataMessage={t('deposit.borrowEmpty')}
        titleComponent={
          <BorrowTitleBox
            isEmpty={userReservesWithDept.length === 0}
            currentBorrowedValue={Number(currentBorrowedValue.toFixed(2))}
            isLoading={loading}
          />
        }
        footer={<BoxLayout gap={1} />}
        isLoading={loading}
      />
      <RepayModal
        isOpen={!!modalData}
        onClose={closeModal}
        reserveData={modalData}
        healthFactor={healthFactor}
      />
    </>
  )
}
