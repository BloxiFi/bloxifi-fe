import React, { FunctionComponent, useState } from 'react'
import { Button, ColumnData, Table } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'
import { DepositModal } from '../modal/DepositModal'

import { WalletBalance, WalletContainer } from '@/containers/WalletContainer'

export const AvaliableToDepositTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: { reserves },
  } = WalletContainer.useContainer()
  const [modalData, setModalData] = useState<WalletBalance>()

  const openModal = (data: WalletBalance) => {
    setModalData(data)
  }

  const closeModal = () => {
    setModalData(undefined)
    //TODO update balance
  }

  const columns = {
    assets: {
      header: t('global.table.assets'),
      Cell: ({ data: { name, icon, fullName } }) => (
        <AssetName symbol={name} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    walletBalance: {
      header: t('global.table.walletBalance'),
      Cell: ({ data: { balance } }) => {
        return <FormattedNumber value={parseFloat(balance)} />
      },
      alignText: 'center',
    },
    APY: {
      header: t('global.table.apy'),
      Cell: ({ data: { supplyAPY } }) => (
        <FormattedNumber value={supplyAPY} percent />
      ),
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: ({ data }) => (
        <Button
          disabled={!data.balance}
          appearance="secondary"
          variant="medium"
          size="small"
          onClick={() => openModal(data)}
        >
          {t('global.button.deposit')}
        </Button>
      ),
      width: 100,
    },
  } as Record<string, ColumnData<WalletBalance>>

  return (
    <>
      <Table
        columns={columns}
        data={reserves}
        titleComponent="Assets to deposit"
        columnSpacing
      />
      {!!modalData && (
        <DepositModal
          isOpen={!!modalData}
          onClose={closeModal}
          reserveData={modalData}
        />
      )}
    </>
  )
}
