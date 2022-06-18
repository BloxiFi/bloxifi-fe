import { Meta } from '@storybook/react'
import React from 'react'

import { Toggle } from '../Toggle'

export default {
  title: 'Components/Toggle',
  component: Toggle,
} as Meta

export const ToggleDefault = () => {
  return <Toggle />
}

ToggleDefault.storyName = 'Toggle unchecked'

export const ToggleChecked = () => {
  return <Toggle checked />
}

ToggleChecked.storyName = 'Toggle checked'

export const ToggleCustomSizes = () => {
  const sizes = [
    { width: 25, paddingTop: 1 },
    { width: 50, paddingTop: 2 },
    { width: 75, paddingTop: 3 },
    { width: 100, paddingTop: 4 },
  ]

  return sizes.map(sizes => <Toggle key={sizes.width} styleProps={sizes} />)
}

ToggleCustomSizes.storyName = 'Custom size togglers'
