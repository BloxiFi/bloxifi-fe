import React from 'react'
import {
  ColumnData,
  ColumnLayout,
  Icon,
  StackLayout,
  Table,
  Text,
  Tooltip,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import { TokenList } from '@bloxifi/core'

import { FormattedNumber } from '../FormattedNumber'

import { HealthFactorNumber } from './HealthFactorNumber'

type TableHeader =
  | 'supplyAPY'
  | 'healthFactor'
  | 'remainingSupply'
  | 'remainingDebt'
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
   * TODO Research how we get and calculate this value
   */
  remainingDebt?: string
  /**
   * Symbol of selected asset
   */
  symbol?: TokenList
  /**
   * List of table headers
   */
  headers: TableHeader[]
  /**
   * Transaction amount
   */
  amount?: string
  /**
   * Future health factor based on transaction type and amount
   */
  futureHealthFactor?: number
}

export const TransactionOverview = ({
  healthFactor,
  supplyAPY,
  remainingSupply,
  remainingDebt,
  symbol,
  headers,
  amount,
  futureHealthFactor,
}: Props) => {
  const { t } = useTranslation()
  const transactionData: TransactionData[] = headers.map(name => ({ name }))
  const shouldDisplayFutureHF =
    amount && healthFactor !== futureHealthFactor && Number(amount) > 0

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
            <ColumnLayout align="flex-end" center>
              <HealthFactorNumber value={healthFactor} />
              {shouldDisplayFutureHF && (
                <>
                  <Icon name="arrow-right" size={15} color="oxfordBlue" />
                  <HealthFactorNumber value={futureHealthFactor} />
                </>
              )}
            </ColumnLayout>

            <Text as="span" type="body 1" color="oxfordBlue">
              {'Liquidation at < 1.00'}
            </Text>
          </StackLayout>
        )
      case 'remainingSupply':
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue" data-cy="remainingSupplyValue">
              {remainingSupply} {symbol}
            </Text>{' '}
          </ColumnLayout>
        )
      case 'remainingDebt':
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue">
              {/**
               * TODO Research how we get and calculate this value
               */}
              {remainingDebt} {symbol}
            </Text>
          </ColumnLayout>
        )
    }
  }

  //The following headers will be displayed with tooltip explanation
  const headersWithTooltip = [
    'healthFactor',
    'remainingSupply',
    'remainingDebt',
  ]

  const transactionColumns = {
    action: {
      header: t('deposit.transactionOverview'),
      Cell: ({ data: { name } }) => {
        if (headersWithTooltip.includes(name)) {
          return (
            <Tooltip element={t(`deposit.${name}`)}>
              <Text color="oxfordBlue" as="span" type="small-text">
                {t(`global.tooltips.modals.${name}`, {
                  amount,
                  symbol,
                })}
              </Text>
            </Tooltip>
          )
        } else {
          return t(`deposit.${name}`)
        }
      },
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
