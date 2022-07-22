import { Meta } from '@storybook/react'
import React from 'react'

import { BaseInput } from '../BaseInput'
import { BoxLayout } from '../Layouts'
import { GridLayout } from '../Layouts/GridLayout'

export default {
  title: 'Components/BaseInput',
  component: BaseInput,
} as Meta

export const Details = args => {
  return (
    <BoxLayout>
      <GridLayout>
        <GridLayout.Column span={3}>
          <BaseInput {...args} />
        </GridLayout.Column>
        <GridLayout.Column span={3}>
          <BaseInput status="success" info="Success" value="Success" />
        </GridLayout.Column>
        <GridLayout.Column span={3}>
          <BaseInput status="error" info="Error" value="Error" />
        </GridLayout.Column>
        <GridLayout.Column span={3}>
          <BaseInput disabled value="Disabled" />
        </GridLayout.Column>
      </GridLayout>
    </BoxLayout>
  )
}

Details.storyName = 'Details'
