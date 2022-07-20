import { Text } from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

type Props = {
  /**
   * Represents the number value
   * */
  readonly value: number
  /**
   * Represents value decimals
   * */
  readonly decimals?: number
  /**
   * This is true if value should be displayed in percentage
   * */
  readonly percent?: boolean
}

export const FormattedNumber: FunctionComponent<Props> = ({
  value,
  decimals,
  percent,
}: Props) => {
  let visibleDecimals = decimals

  if (value === 0) {
    visibleDecimals = 0
  } else if (decimals === undefined) {
    if (percent) {
      visibleDecimals = 2
    } else if (value > 1) {
      visibleDecimals = 4
    } else {
      visibleDecimals = 7
    }
  }

  const minValue = 10 ** -visibleDecimals
  const isSmallerThanMin = value !== 0 && Math.abs(value) < Math.abs(minValue)
  const formattedNumber = isSmallerThanMin ? minValue : value

  return (
    <Text type="body 3" as="span">
      {isSmallerThanMin && '<'}
      {formattedNumber.toFixed(visibleDecimals)}
      {percent && '%'}
    </Text>
  )
}
