import { FormatAPYOptions, useFormatAPY } from '@bloxifi/core'
import { Text } from '@bloxifi/ui'
import React from 'react'

export const FormattedNumber = (props: FormatAPYOptions) => {
  const formatedValue = useFormatAPY(props)

  return <span>{formatedValue}</span>
}
