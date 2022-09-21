import React from 'react'
import { BoxLayout, Text } from '@bloxifi/ui'

interface Props {
  /**
   * An error message to be displayed
   */
  message?: string
}

/**
 *  Component that returns an error message
 */
export const ErrorMessage = ({ message }: Props) => {
  return (
    <BoxLayout style={{ margin: 0 }} gap={1.25}>
      <Text color="red">{message}&nbsp;</Text>
    </BoxLayout>
  )
}
