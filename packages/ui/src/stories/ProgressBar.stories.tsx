import { Meta } from '@storybook/react'
import React from 'react'

import { GridLayout } from '../Layouts'
import { ProgressBar } from '../ProgressBar'

export default {
  title: 'Components/Probress bar',
  component: ProgressBar,
} as Meta

export const ProgressBarStory = args => (
  <GridLayout>
    <GridLayout.Column span={4}>
      <ProgressBar title="Borrowed" value={56} showBottomLabel {...args} />
    </GridLayout.Column>
  </GridLayout>
)

ProgressBarStory.story = {
  name: 'Overview',
}
