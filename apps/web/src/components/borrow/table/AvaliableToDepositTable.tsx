import React, { FunctionComponent, useState } from 'react'
import {
  Button,
  ColumnData,
  Table,
  Text,
  Tooltip,
  TruncatedText,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import { MIN_VALUE_FOR_TRANSACTION } from '@bloxifi/core'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'
import { DepositModal } from '../modal/DepositModal'

import { ReservesData, WalletContainer } from '@/containers/WalletContainer'

export const AvaliableToDepositTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: { reserves, loading },
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
            <FormattedNumber value={Number(balance)} />
          </TruncatedText>
        )
      },
      alignText: 'center',
    },
    APY: {
      header: (
        <Tooltip element={t('global.table.apy')}>
          <Text color="oxfordBlue" as="span" type="small-text">
            {t('global.tooltips.supplyAPY')}
          </Text>
        </Tooltip>
      ),
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
          appearance="secondary"
          variant="medium"
          size="small"
          disabled={Number(data.balance) < MIN_VALUE_FOR_TRANSACTION}
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
      />
    </>
  )
}
