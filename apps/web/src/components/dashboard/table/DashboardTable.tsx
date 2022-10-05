import React, { FunctionComponent } from 'react'
import { ColumnData, Table, TruncatedText } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import { convertToUSD } from '@bloxifi/core'

import {
  DashboardReservesData,
  DashboardContainer,
} from '@/containers/DashboardContainer'
import { AssetName } from '@/components/borrow/AssetName'
import { FormattedNumber } from '@/components/borrow/FormattedNumber'

export const DashboardTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: { reserves, loading },
  } = DashboardContainer.useContainer()

  const columns = {
    assets: {
      header: t('global.table.assets'),
      Cell: ({ data: { symbol, icon, fullName } }: any) => (
        <AssetName symbol={symbol} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    totalValueDeposited: {
      header: t('global.table.totalDeposited'),
      Cell: ({ data: { totalATokenSupply, priceInEth, usdPriceEth } }) => (
        <TruncatedText>
          <FormattedNumber
            value={convertToUSD(totalATokenSupply, priceInEth, usdPriceEth)}
            symbol="USD"
          />
        </TruncatedText>
      ),
    },
    totalBorrowed: {
      header: t('global.table.totalBorrowed'),
      Cell: ({
        data: { totalCurrentVariableDebt, priceInEth, usdPriceEth },
      }) => (
        <TruncatedText>
          <FormattedNumber
            value={convertToUSD(
              totalCurrentVariableDebt,
              priceInEth,
              usdPriceEth,
            )}
            symbol="USD"
          />
        </TruncatedText>
      ),
    },
    supplyAPY: {
      header: t('global.table.depositAPY'),
      Cell: ({ data: { supplyAPY } }) => (
        <TruncatedText>
          <FormattedNumber value={supplyAPY} percent />
        </TruncatedText>
      ),
    },
    variableBorrowAPY: {
      header: t('global.table.borrowAPY'),
      Cell: ({ data: { variableBorrowAPY } }) => (
        <TruncatedText>
          <FormattedNumber value={variableBorrowAPY} percent />
        </TruncatedText>
      ),
    },
  } as Record<string, ColumnData<DashboardReservesData>>

  return (
    <Table
      columns={columns}
      data={reserves}
      columnSpacing
      headerSpacing
      isLoading={loading}
    />
  )
}
