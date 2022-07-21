import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Text } from 'recharts'

import { Icon, IconNames, IconProps } from '../Icon'
import { BoxLayout, ColumnLayout, StackLayout } from '../Layouts'
import { Colors } from '../styles/colors'

export default {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'arrow-down', size: 36, color: Colors.gray30 },
} as Meta<IconProps>

export const AllIcons = () => {
  return (
    <BoxLayout>
      <ColumnLayout>
        {IconNames.map(iconName => (
          <StackLayout center key={iconName}>
            <Icon size={36} name={iconName} />
            <Text type="body 1">{iconName}</Text>
          </StackLayout>
        ))}
      </ColumnLayout>
    </BoxLayout>
  )
}

export const Details: Story<IconProps> = args => {
  return (
    <BoxLayout>
      <Icon {...args} />
    </BoxLayout>
  )
}

Details.storyName = 'Details'
Details.args = { color: 'gray' }

AllIcons.storyName = 'All icons'
