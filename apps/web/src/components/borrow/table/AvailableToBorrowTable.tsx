import React, { useState, FunctionComponent } from 'react'
import { Button, ColumnData, Table } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'
import { BorrowModal } from '../modal/BorrowModal'

import { ReservesData, WalletContainer } from '@/containers/WalletContainer'

export const AvailableToBorrowTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: { reserves },
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
    walletBalance: {
      header: t('global.table.walletBalance'),
      Cell: ({ data: { balance } }: any) => {
        return <FormattedNumber value={balance} />
      },
      alignText: 'center',
    },
    APY: {
      header: t('global.table.apy'),
      Cell: ({ data: { variableBorrowAPY } }) => (
        <FormattedNumber value={variableBorrowAPY} percent />
      ),
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: ({ data }) => (
        <Button
          appearance="secondary"
          variant="medium"
          size="small"
          onClick={() => openModal(data)}
        >
          {t('global.buttons.borrow')}
        </Button>
      ),
      width: 100,
    },
  } as Record<string, ColumnData<ReservesData>>

  return (
    <>
      <Table
        columns={columns}
        data={reserves}
        titleComponent={t('deposit.assetsToBorrow')}
        columnSpacing
      />
      <BorrowModal
        isOpen={!!modalData}
        onClose={closeModal}
        reserveData={modalData}
      />
    </>
  )
}
