import {
  BaseInput,
  BaseInputProps,
  BoxLayout,
  Button,
  ColumnLayout,
  StackLayout,
  Text,
} from '@bloxifi/ui'
import React, { ForwardedRef, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { AssetName } from '../AssetName'

import { ReservesData } from '@/containers/WalletContainer'

type TableInputData = Pick<ReservesData, 'symbol' | 'icon'>

interface Props extends BaseInputProps {
  /**
   *  Function that is used to set amount value when user clicks on MAX button
   */
  setMaxValue: () => void
  /**
   * Selected asset data - Balance and symbol
   */
  reserveData: TableInputData
}

export const AmountInput = forwardRef(
  (
    {
      type = 'number',
      reserveData,
      setMaxValue,
      disabled,
      ...inputProps
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation()

    const blockInvalidChar = (event: React.KeyboardEvent<HTMLInputElement>) =>
      ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault()

    return (
      <StackLayout>
        <BoxLayout gap={1.25}>
          <Text color="oxfordBlue" type="heading 3" as="span">
            {t('global.inputs.amount')}
          </Text>
        </BoxLayout>
        <InputWrapper>
          <BoxLayout>
            <ColumnLayout>
              <BaseInput
                type={type}
                onKeyDown={blockInvalidChar}
                disabled={disabled}
                {...inputProps}
                ref={ref}
              />

              <Button
                appearance="secondary"
                variant="thin"
                size="small"
                className="u-fit-content-width"
                onClick={setMaxValue}
                disabled={disabled}
              >
                MAX
              </Button>
            </ColumnLayout>
          </BoxLayout>
          <BoxLayout>
            <Text color="oxfordBlue" type="heading 3" as="span">
              <AssetName
                symbol={reserveData.symbol}
                icon={reserveData.icon}
                iconSize={25}
              />
            </Text>
          </BoxLayout>
        </InputWrapper>
      </StackLayout>
    )
  },
)

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.tableBorderColor};
  border-bottom: 1px solid ${({ theme }) => theme.tableBorderColor};
`
