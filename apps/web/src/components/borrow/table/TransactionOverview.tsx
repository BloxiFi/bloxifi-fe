import React, { useContext } from 'react'
import {
  ColumnData,
  ColumnLayout,
  Icon,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import { ThemeContext } from 'styled-components'

import { FormattedNumber } from '../FormattedNumber'

import { WalletBalance } from '@/containers/WalletContainer'

type TableHeader = 'Supply APY' | 'Health factor'
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
  const themeContext = useContext(ThemeContext)

  const transactionData: TransactionData[] = []
  headers.map(name => transactionData.push({ name }))

  const getColumnValue = (name: TableHeader) => {
    switch (name) {
      case 'Supply APY':
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue">
              <FormattedNumber value={reserveData.supplyAPY} percent />
            </Text>
          </ColumnLayout>
        )
      case 'Health factor':
        return (
          <StackLayout>
            <ColumnLayout align="flex-end" center>
              <Icon name="union" size={16} color={themeContext.buttonDark} />
              <Icon
                name="arrow-right"
                size={15}
                color={themeContext.buttonDark}
              />
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
      header: 'Transaction overview',
      Cell: ({ data: { name } }) => (
        <Text type="body 3" color="oxfordBlue" as="span">
          {name}
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
