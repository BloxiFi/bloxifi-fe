import { Meta, Story } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Icon, IconNames, IconProps } from '../Icon'
import { Colors } from '../styles/colors'

export default {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'arrow-down', size: 36, color: Colors.textGray },
} as Meta<IconProps>

export const AllIcons = () => {
  return (
    <Wrapper>
      {IconNames.map(iconName => (
        <div key={iconName}>
          <Icon size={36} name={iconName} />
          <div>{iconName}</div>
        </div>
      ))}
    </Wrapper>
  )
}

export const Details: Story<IconProps> = args => {
  return <Icon {...args} />
}

Details.storyName = 'Details'

AllIcons.storyName = 'All icons'

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: 1rem;

  svg {
    margin: auto;
  }
`
