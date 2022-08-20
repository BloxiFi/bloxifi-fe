import React, { useState, FunctionComponent } from 'react'
import { Button, ColumnData, Table, TruncatedText } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import {
  convertUSDToAssetValue,
  MIN_VALUE_FOR_TRANSACTION,
} from '@bloxifi/core'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'
import { BorrowModal } from '../modal/BorrowModal'

import { ReservesData, WalletContainer } from '@/containers/WalletContainer'

export const AvailableToBorrowTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: {
      availableToBorrowUSD,
      reserves,
      userAccountData: { healthFactor },
      loading,
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
      header: t('global.table.available'),
      Cell: ({ data: { usdPriceEth, priceInEth } }) => {
        return (
          <TruncatedText>
            <FormattedNumber
              value={convertUSDToAssetValue(
                availableToBorrowUSD,
                priceInEth,
                usdPriceEth,
              )}
            />
          </TruncatedText>
        )
      },
      alignText: 'center',
    },
    APY: {
      header: t('global.table.apy'),
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
          disabled={
            convertUSDToAssetValue(
              availableToBorrowUSD,
              data.priceInEth,
              data.usdPriceEth,
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
        healthFactor={healthFactor}
      />
    </>
  )
}
