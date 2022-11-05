import {
  BoxLayout,
  CardLayout,
  ColumnData,
  ColumnLayout,
  Icon,
  Table,
  Text,
} from '@bloxifi/ui'
import { TokenBalanceData } from '@bloxifi/core'
import React, { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  balances: TokenBalanceData[]
}
export const CrossChainAssetTable: FunctionComponent<Props> = ({
  balances,
}: Props) => {
  const { t } = useTranslation()

  const columns = {
    asset: {
      header: '',
      Cell: ({ data: { tokenOrigin, tokenOriginSymbol } }) => (
        <ColumnLayout gap={1.5}>
          <Icon size={40} name={'dai'} />
          <Text as="span" type="body 2">
            {tokenOrigin} {tokenOriginSymbol}
          </Text>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    value: {
      header: '',
      Cell: ({ data: { tokenSymbol, tokenBalance } }) => (
        <Text as="span" type="body 2">
          {tokenBalance} {tokenSymbol}
        </Text>
      ),
      alignText: 'right',
    },
  } as Record<string, ColumnData<TokenBalanceData>>

  return (
    <CardLayout>
      <Table
        columns={columns}
        data={balances}
        titleComponent={
          <>
            <Text as="span" type="heading 2">
              {t('transfer.crossChainAssets')}
            </Text>
            <BoxLayout gap={1.15} />
          </>
        }
        columnSpacing
        compact
      />
      <BoxLayout gap={3.25} />
    </CardLayout>
  )
}
