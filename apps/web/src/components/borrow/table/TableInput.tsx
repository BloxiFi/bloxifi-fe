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

import { WalletBalance } from '@/containers/WalletContainer'

interface Props {
  handleInputChange: (value: string) => void
  amount: string
  reserveData: WalletBalance
  status?: 'error'
}

export const TableInput = ({
  handleInputChange,
  amount,
  reserveData,
  status,
}: Props) => {
  const tableColumns = {
    action: {
      header: 'Amount',
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
  } as Record<string, ColumnData<WalletBalance>>

  const Title = () => (
    <Text color="oxfordBlue" type="heading 2" as="span">
      Deposit asset
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
