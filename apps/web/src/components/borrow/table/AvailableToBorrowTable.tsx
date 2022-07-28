import React, { FunctionComponent } from 'react'
import { Button, ColumnData, Table } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'

import { WalletBalance, WalletContainer } from '@/containers/WalletContainer'

export const AvailableToBorrowTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: { reserves },
  } = WalletContainer.useContainer()

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
      Cell: () => <FormattedNumber value={0.0568} percent />,
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: () => (
        <Button appearance="secondary" variant="medium" size="small">
          {t('global.buttons.borrow')}
        </Button>
      ),
      width: 100,
    },
  } as Record<string, ColumnData<WalletBalance>>

  return (
    <Table
      columns={columns}
      data={reserves}
      titleComponent={t('deposit.assetsToBorrow')}
      columnSpacing
    />
  )
}
