import React from 'react'
import { ColumnData, ColumnLayout, StackLayout, Table, Text } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import { TokenList } from 'packages/core/src'

import { FormattedNumber } from '../FormattedNumber'

type TableHeader = 'supplyAPY' | 'healthFactor' | 'remainingSupply'
type TransactionData = { name: TableHeader }

interface Props {
  /**
   * Selected asset APY
   */
  supplyAPY?: number
  /**
   * User health factor value
   */
  healthFactor?: number
  /**
   * TODO Research how we get and calculate this value
   */
  remainingSupply?: string
  /**
   * Symbol of selected asset
   */
  symbol?: TokenList
  /**
   * List of table headers
   */
  headers: TableHeader[]
}

export const TransactionOverview = ({
  healthFactor,
  supplyAPY,
  remainingSupply,
  symbol,
  headers,
}: Props) => {
  const { t } = useTranslation()

  const transactionData: TransactionData[] = headers.map(name => ({ name }))

  const getColumnValue = (name: TableHeader) => {
    switch (name) {
      case 'supplyAPY':
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue">
              <FormattedNumber value={supplyAPY} percent />
            </Text>
          </ColumnLayout>
        )
      case 'healthFactor':
        return (
          <StackLayout>
            {/**
             * We will use this code to display future health factor
             * 
             * <ColumnLayout align="flex-end" center>
                <Icon name="union" size={16} color="oxfordBlue" />
                <Icon name="arrow-right" size={15} color="oxfordBlue" />
              </ColumnLayout>
             */}
            <Text as="span" type="body 1" color="oxfordBlue">
              <FormattedNumber value={healthFactor} />
            </Text>
            <Text as="span" type="body 1" color="oxfordBlue">
              {'Liquidation at < 1.00'}
            </Text>
          </StackLayout>
        )
      case 'remainingSupply':
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue">
              {/**
               * TODO Research how we get and calculate this value
               */}
              {remainingSupply} {symbol}
            </Text>
          </ColumnLayout>
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
