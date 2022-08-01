import {
  BaseInput,
  Button,
  ColumnData,
  ColumnLayout,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ReservesData } from '@/containers/WalletContainer'

interface Props {
  handleInputChange: (value: string) => void
  amount: string
  reserveData: ReservesData
  status?: 'error'
  title: string
}

export const TableInput = ({
  handleInputChange,
  amount,
  reserveData,
  status,
  title,
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e.target.value)
              }
              value={amount}
            />
          </StackLayout>
          <Button
            appearance="secondary"
            variant="thin"
            size="small"
            className="u-fit-content-width"
            onClick={() => handleInputChange(reserveData.balance)}
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
      {title}
    </Text>
  )

  return (
    <Table
      compact
      columns={tableColumns}
      data={[reserveData]}
      titleComponent={<Title />}
    />
  )
}
