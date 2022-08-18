import React, { FunctionComponent, useState } from 'react'
import { Button, ColumnData, Table, TruncatedText } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'
import { DepositModal } from '../modal/DepositModal'

import { ReservesData, WalletContainer } from '@/containers/WalletContainer'

export const AvaliableToDepositTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: {
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
      Cell: ({ data: { name, icon, fullName } }) => (
        <AssetName symbol={name} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    walletBalance: {
      header: t('global.table.walletBalance'),
      Cell: ({ data: { balance } }) => {
        return (
          <TruncatedText>
            <FormattedNumber value={balance} />
          </TruncatedText>
        )
      },
      alignText: 'center',
    },
    APY: {
      header: t('global.table.apy'),
      Cell: ({ data: { supplyAPY } }) => (
        <FormattedNumber value={supplyAPY} percent />
      ),
      alignText: 'center',
      width: 100,
    },
    action: {
      header: '',
      Cell: ({ data }) => (
        <Button
          //disabled={!data.balance}
          appearance="secondary"
          variant="medium"
          size="small"
          disabled={data.balance<0.0000001 ? true : false}
          onClick={() => openModal(data)}
        >
          {t('global.buttons.deposit')}
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
        titleComponent={t('deposit.assetsToDeposit')}
        columnSpacing
        isLoading={loading}
      />
      <DepositModal
        isOpen={!!modalData}
        onClose={closeModal}
        reserveData={modalData}
        healthFactor={healthFactor}
      />
    </>
  )
}
