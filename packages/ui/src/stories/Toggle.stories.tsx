import { Meta } from '@storybook/react'
import React from 'react'

import { Toggle } from '../Toggle'
import { BoxLayout } from '../Layouts'

export default {
  title: 'Components/Toggle',
  component: Toggle,
} as Meta

export const ToggleDefault = () => {
  return (
    <BoxLayout>
      <Toggle />
    </BoxLayout>
  )
}

ToggleDefault.storyName = 'Toggle unchecked'

export const ToggleChecked = () => {
  return (
    <BoxLayout>
      <Toggle checked />
    </BoxLayout>
  )
}

ToggleChecked.storyName = 'Toggle checked'

export const ToggleCustomSizes = () => {
  const sizes = [
    { width: 25, paddingTop: 1 },
    { width: 50, paddingTop: 2 },
    { width: 75, paddingTop: 3 },
    { width: 100, paddingTop: 4 },
  ]

  return (
    <BoxLayout>
      {sizes.map(sizes => (
        <Toggle key={sizes.width} styleProps={sizes} />
      ))}
    </BoxLayout>
  )
}

ToggleCustomSizes.storyName = 'Custom size togglers'
