import { Meta } from '@storybook/react'
import React from 'react'

import { GridLayout } from '../Layouts/GridLayout'
import { RangeBar } from '../RangeBar'

export default {
  title: 'Components/Range bar',
  component: RangeBar,
} as Meta

export const rangeBar = args => (
  <GridLayout>
    <GridLayout.Column span={4}>
      <RangeBar title="Duration" min={1} max={36} stepvalue={1} {...args} />
    </GridLayout.Column>
  </GridLayout>
)

rangeBar.story = {
  name: 'Horizontal',
}
