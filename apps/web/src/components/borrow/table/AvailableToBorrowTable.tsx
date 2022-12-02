import React, { useState, FunctionComponent } from 'react'
import {
  Button,
  ColumnData,
  Table,
  Text,
  Tooltip,
  TruncatedText,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import {
  bigNumberToNumber,
  convertETHToAssetValue,
  getMaxBorrowAmount,
  MIN_VALUE_FOR_TRANSACTION,
  numberToBigNumber,
} from '@bloxifi/core'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'
import { BorrowModal } from '../modal/BorrowModal'

import { ReservesData, WalletContainer } from '@/containers/WalletContainer'

export const AvailableToBorrowTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: {
      reserves,
      loading,
      userAccountData: {
        availableBorrowsETH,
        totalCollateralETH,
        totalDebtETH,
      },
    },
  } = WalletContainer.useContainer()
  const [modalData, setModalData] = useState<ReservesData>()

  const openModal = (data: ReservesData) => {
    setModalData(data)
  }

  const closeModal = () => {
    setModalData(undefined)
    //TODO update balance
  }
  const columns = {
    assets: {
      header: t('global.table.assets'),
      Cell: ({ data: { symbol, icon, fullName } }: any) => (
        <AssetName symbol={symbol} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    available: {
      header: (
        <Tooltip element={t('global.table.available')}>
          <Text color="oxfordBlue" as="span" type="small-text">
            {t('global.tooltips.availableToBorrow')}
          </Text>
        </Tooltip>
      ),
      Cell: ({ data: { priceInEth, symbol, aTokenBalance } }) => {
        const maxBorrow = bigNumberToNumber(
          getMaxBorrowAmount({
            aTokenBalance,
            availableBorrowsETH,
            priceInEth,
            totalCollateralETH,
            totalDebtETH,
          }),
        )
        return (
          <TruncatedText data-cy={'availableToBorrow ' + symbol}>
            <FormattedNumber value={maxBorrow} />
          </TruncatedText>
        )
      },
      alignText: 'center',
    },
    APY: {
      header: (
        <Tooltip element={t('global.table.apy')}>
          <Text color="oxfordBlue" as="span" type="small-text">
            {t('global.tooltips.borrowAPY')}
          </Text>
        </Tooltip>
      ),
      Cell: ({ data: { variableBorrowAPY } }) => (
        <FormattedNumber value={variableBorrowAPY} percent />
      ),
      alignText: 'center',
      width: 100,
    },
    action: {
      header: '',
      Cell: ({ data }) => (
        <Button
          appearance="secondary"
          variant="medium"
          size="small"
          data-cy={'borrowBtn ' + data.symbol}
          disabled={
            bigNumberToNumber(
              convertETHToAssetValue(
                availableBorrowsETH,
                numberToBigNumber(data.priceInEth),
              ),
            ) < MIN_VALUE_FOR_TRANSACTION
          }
          onClick={() => openModal(data)}
        >
          {t('global.buttons.borrow')}
        </Button>
      ),
      width: 160,
    },
  } as Record<string, ColumnData<ReservesData>>

  return (
    <>
      <Table
        data-cy="BorrowTable"
        columns={columns}
        data={reserves}
        titleComponent={t('deposit.assetsToBorrow')}
        columnSpacing
        isLoading={loading}
      />
      <BorrowModal
        isOpen={!!modalData}
        onClose={closeModal}
        reserveData={modalData}
      />
    </>
  )
}
