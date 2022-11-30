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
import { isAllowedNumberOfDecimals, PATTERN_NUMBERS_ONLY } from '@bloxifi/core'

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
  /**
   * This should be set to false if validation is not needed. Default is true
   */
  shouldValidate?: boolean
}

export const AmountInput = forwardRef(
  (
    {
      reserveData,
      setMaxValue,
      disabled,
      onChange,
      shouldValidate = true,
      ...inputProps
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation()
    /**
     * Validation includes: Prevent user to insert invalid characters & Limit number of decimals
     */
    const validate = (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      const value = target.value
      if (!value) {
        return onChange(e)
      }
      const isValid =
        value !== '.' &&
        PATTERN_NUMBERS_ONLY.test(value) &&
        isAllowedNumberOfDecimals(value)
      return isValid ? onChange(e) : e.preventDefault()
    }

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
                disabled={disabled}
                onChange={shouldValidate ? validate : onChange}
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
            <Text
              color="oxfordBlue"
              type="heading 3"
              as="span"
              data-cy="token name"
            >
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
