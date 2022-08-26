import { Meta } from '@storybook/react'
import React from 'react'
import { styled } from '@storybook/theming'
import { element } from 'prop-types'

import { BoxLayout, GridLayout, ColumnLayout, StackLayout } from '../Layouts'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    width: 200,
    position: 'top',
    effect: 'float',
  },
} as Meta

export const TooltipDefault = args => {
  return (
    <StackLayout gap={2.125}>
      <ColumnLayout center gap={1}>
        <Text color="oxfordBlue" as="span" type="body 2">
          Balance $
          <Tooltip
            element={
              <Text as="span" color="oxfordBlue" bold data-tip="adsfv">
                1.00
              </Text>
            }
            {...args}
          />
        </Text>
      </ColumnLayout>
    </StackLayout>
  )
}

TooltipDefault.storyName = 'Tooltip text'
