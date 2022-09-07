import { Meta } from '@storybook/react'
import React, { useState } from 'react'

import { GridLayout } from '../Layouts/GridLayout'
import { RangeInput } from '../RangeInput'

export default {
  title: 'Components/Range input',
  component: RangeInput,
} as Meta

export const RangeInp = (args: any) => {
  const [val, setVal] = useState('24')
  return (
    <GridLayout>
      <GridLayout.Column span={12}>
        <RangeInput
          title="Deposit duration"
          min={1}
          step={1}
          max={36}
          type="range"
          value={val}
          showlabel
          {...args}
          onInput={e => {
            setVal((e.target as HTMLInputElement).value)
          }}
        />
      </GridLayout.Column>
    </GridLayout>
  )
}

RangeInp.story = {
  name: 'Horizontal',
}
