import { FormatNumberOptions, useFormatNumber } from '@bloxifi/core'
import React from 'react'

export const FormattedNumber = (props: FormatNumberOptions) => {
  const formatedValue = useFormatNumber(props)

  return <span>{formatedValue}</span>
}
