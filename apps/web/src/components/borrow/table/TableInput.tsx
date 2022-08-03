import {
  BaseInput,
  BaseInputProps,
  Button,
  ColumnData,
  ColumnLayout,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import React, { ForwardedRef, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ReservesData } from '@/containers/WalletContainer'

interface Props extends BaseInputProps {
  setFieldValue: (field: 'amount', value: number) => void
  reserveData: ReservesData
}

export const TableInput = forwardRef(
  (
    { reserveData, setFieldValue, disabled, ...inputProps }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation()

    const tableColumns = {
      action: {
        header: t('deposit.amount'),
        Cell: () => (
          <ColumnLayout gap={0.5}>
            <StackLayout>
              <BaseInput disabled={disabled} {...inputProps} ref={ref} />
            </StackLayout>
            <Button
              appearance="secondary"
              variant="thin"
              size="small"
              className="u-fit-content-width"
              onClick={() =>
                setFieldValue('amount', Number(reserveData.balance))
              }
              disabled={disabled}
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
  },
)
