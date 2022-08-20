import React, { FunctionComponent } from 'react'
import { ColumnData, Table, TruncatedText } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import { convertToUSD } from '@bloxifi/core'

import { ReservesData, WalletContainer } from '@/containers/WalletContainer'
import { AssetName } from '@/components/borrow/AssetName'
import { FormattedNumber } from '@/components/borrow/FormattedNumber'

export const DashboardTable: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    state: { reserves, loading },
  } = WalletContainer.useContainer()

  const columns = {
    assets: {
      header: t('global.table.assets'),
      Cell: ({ data: { symbol, icon, fullName } }: any) => (
        <AssetName symbol={symbol} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    totalValueDeposited: {
      header: 'Total value deposited',
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
      header: 'Total borrowed',
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
      header: 'Deposit APY',
      Cell: ({ data: { supplyAPY } }) => (
        <TruncatedText>
          <FormattedNumber value={supplyAPY} percent />
        </TruncatedText>
      ),
    },
    variableBorrowAPY: {
      header: 'Borrow APY',
      Cell: ({ data: { variableBorrowAPY } }) => (
        <TruncatedText>
          <FormattedNumber value={variableBorrowAPY} percent />
        </TruncatedText>
      ),
    },
  } as Record<string, ColumnData<ReservesData>>

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
