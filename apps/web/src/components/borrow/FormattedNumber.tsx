import { FormatAPYOptions, useFormatAPY } from '@bloxifi/core'
import React from 'react'

export const FormattedNumber = (props: FormatAPYOptions) => {
  const formatedValue = useFormatAPY(props)

  return <span>{formatedValue}</span>
}
