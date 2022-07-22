import { FormatAPYOptions, useFormatAPY } from '@bloxifi/core'
import { Text } from '@bloxifi/ui'
import React from 'react'

export const FormattedNumber = (props: FormatAPYOptions) => {
  const formatedValue = useFormatAPY(props)

  return (
    <Text type="body 3" as="span">
      {formatedValue}
    </Text>
  )
}
