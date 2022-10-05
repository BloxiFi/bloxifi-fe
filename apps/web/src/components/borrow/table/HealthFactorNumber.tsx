import React from 'react'
import { Text, TextColors } from '@bloxifi/ui'
import { MIN_HEALTH_FACTOR_VALUE } from '@bloxifi/core'

import { FormattedNumber } from '../FormattedNumber'

interface Props {
  /**
   * Health factor value
   */
  value?: number
}

export const HealthFactorNumber = ({ value }: Props) => {
  let healthFactorColor: typeof TextColors[number] = 'oxfordBlue'
  if (value >= 3) {
    healthFactorColor = 'green'
  } else if (value < 1.1) {
    healthFactorColor = 'red'
  }

  /** When we returns infinity
   * <Icon name="union" size={16} color="oxfordBlue" />
   **/
  return (
    <Text as="span" type="body 1" color={healthFactorColor}>
      <FormattedNumber
        decimals={2}
        value={value}
        minimumDisplayValue={MIN_HEALTH_FACTOR_VALUE}
      />
    </Text>
  )
}
