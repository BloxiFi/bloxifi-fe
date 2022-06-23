import { Meta, Story } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Icon, IconNames, IconProps } from '../Icon'
import { ColumnLayout } from '../Layouts'
import { Colors } from '../styles/colors'

export default {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'arrow-down', size: 36, color: Colors.gray30 },
} as Meta<IconProps>

export const AllIcons = () => {
  return (
    <ColumnLayout>
      {IconNames.map(iconName => (
        <div key={iconName}>
          <Icon size={36} name={iconName} />
          <div>{iconName}</div>
        </div>
      ))}
    </ColumnLayout>
  )
}

export const Details: Story<IconProps> = args => {
  return <Icon {...args} />
}

Details.storyName = 'Details'

AllIcons.storyName = 'All icons'
