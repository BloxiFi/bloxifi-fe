import { Meta } from '@storybook/react'
import React from 'react'

import { ColumnLayout } from '../Layouts'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    width: 200,
    position: 'top',
    effect: 'float',
    tooltipText: 'Total Borrowed amount divided by total collateral amount.',
  },
} as Meta

export const TooltipDefault = args => {
  return (
    <ColumnLayout align="center" style={{ minHeight: 400 }}>
      <Text color="oxfordBlue" as="p" type="body 2">
        <Tooltip
          {...args}
          element={
            <Text as="span" color="oxfordBlue" bold>
              Remaining debt
            </Text>
          }
        />
      </Text>
    </ColumnLayout>
  )
}

TooltipDefault.storyName = 'Overview'
TooltipDefault.parameters = {
  storyshots: { disable: true },
}
