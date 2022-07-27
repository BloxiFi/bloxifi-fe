import React from 'react'
import {
  ColumnData,
  ColumnLayout,
  Icon,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { FormattedNumber } from '../FormattedNumber'

import { WalletBalance } from '@/containers/WalletContainer'

type TableHeader = 'supplyAPY' | 'healthFactor'
type TransactionData = { name: TableHeader }

interface Props {
  /**
   * Selected asset reserve data
   */
  reserveData: WalletBalance
  /**
   * List of table headers
   */
  headers: TableHeader[]
}

export const TransactionOverview = ({ reserveData, headers }: Props) => {
  const { t } = useTranslation()

  const transactionData: TransactionData[] = headers.map(name => ({ name }))

  const getColumnValue = (name: TableHeader) => {
    switch (name) {
      case 'supplyAPY':
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue">
              <FormattedNumber value={reserveData.supplyAPY} percent />
            </Text>
          </ColumnLayout>
        )
      case 'healthFactor':
        return (
          <StackLayout>
            <ColumnLayout align="flex-end" center>
              <Icon name="union" size={16} color="oxfordBlue" />
              <Icon name="arrow-right" size={15} color="oxfordBlue" />
              <Text as="span" type="body 1" color="oxfordBlue">
                1.00
              </Text>
            </ColumnLayout>
            <Text as="span" type="body 1" color="oxfordBlue">
              {'Liquidation at < 1.00'}
            </Text>
          </StackLayout>
        )
    }
  }

  const transactionColumns = {
    action: {
      header: t('deposit.transactionOverview'),
      Cell: ({ data: { name } }) => (
        <Text type="body 3" color="oxfordBlue" as="span">
          {t(`deposit.${name}`)}
        </Text>
      ),
      alignText: 'left',
    },
    value: {
      header: '',
      Cell: ({ data: { name } }) => getColumnValue(name),
      alignText: 'right',
    },
  } as Record<string, ColumnData<TransactionData>>

  return <Table compact columns={transactionColumns} data={transactionData} />
}
