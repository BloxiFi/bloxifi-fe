import {
  BaseInput,
  Button,
  ColumnData,
  ColumnLayout,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import React, { HTMLProps } from 'react'
import { useTranslation } from 'react-i18next'

import { ReservesData } from '@/containers/WalletContainer'

interface Props extends HTMLProps<HTMLInputElement> {
  setFieldValue: (field: 'amount', value: number) => void
  amount: string
  reserveData: ReservesData
  status?: 'error'
  info?: string
}

export const TableInput = ({
  amount,
  reserveData,
  status,
  setFieldValue,
  info,
  ...inputProps
}: Props) => {
  const { t } = useTranslation()

  const tableColumns = {
    action: {
      header: t('deposit.amount'),
      Cell: () => (
        <ColumnLayout gap={0.5}>
          <StackLayout>
            <BaseInput
              status={status}
              value={amount}
              info={info}
              {...inputProps}
            />
          </StackLayout>
          <Button
            appearance="secondary"
            variant="thin"
            size="small"
            className="u-fit-content-width"
            onClick={() => setFieldValue('amount', Number(reserveData.balance))}
          >
            MAX
          </Button>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    asset: {
      header: '',
      Cell: ({ data: { symbol } }) => <span>{symbol}</span>,
      alignText: 'right',
    },
  } as Record<string, ColumnData<ReservesData>>

  const Title = () => (
    <Text color="oxfordBlue" type="heading 2" as="span">
      {t('deposit.depositAsset')}
    </Text>
  )

  return (
    <Table
      compact
      columns={tableColumns}
      data={[reserveData]}
      titleComponent={<Title />}
      columnSpacing
    />
  )
}
