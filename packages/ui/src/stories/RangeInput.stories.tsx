import { Meta } from '@storybook/react'
import React, { useState } from 'react'

import { GridLayout } from '../Layouts/GridLayout'
import { RangeInput } from '../RangeInput'
import { Text } from '../Text'

export default {
  title: 'Components/Range input',
  component: RangeInput,
} as Meta

export const RangeInp = (args: any) => {
  const [val, setVal] = useState(24)
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
          onInput={e => {
            setVal(e.target.value)
          }}
        />
      </GridLayout.Column>
      <GridLayout.Column span={2}>
        <Text color="oxfordBlue" type="body 1" align="center">
          1 month
        </Text>
      </GridLayout.Column>
      <GridLayout.Column span={2}>
        <Text color="oxfordBlue" type="body 1" align="center">
          12 months
        </Text>
      </GridLayout.Column>
      <GridLayout.Column span={2}>
        <Text color="oxfordBlue" type="body 1" align="center">
          24 months
        </Text>
      </GridLayout.Column>
      <GridLayout.Column span={2}>
        <Text color="oxfordBlue" type="body 1" align="center">
          36 months
        </Text>
      </GridLayout.Column>
    </GridLayout>
  )
}

RangeInp.story = {
  name: 'Horizontal',
}
