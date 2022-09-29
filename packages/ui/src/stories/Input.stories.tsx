import { Meta } from '@storybook/react'
import React from 'react'

import { AddressInput } from '../AddressInput'
import { BaseInput } from '../BaseInput'
import { BoxLayout } from '../Layouts'
import { GridLayout } from '../Layouts/GridLayout'
import { Text } from '../Text'

export default {
  title: 'Components/Input',
} as Meta

export const BaseInputComponent = args => {
  return (
    <BoxLayout>
      <GridLayout>
        <GridLayout.Column span={6}>
          <Text type="heading 3">Empty</Text>
          <BaseInput {...args} />
        </GridLayout.Column>
        <GridLayout.Column span={6}>
          <Text type="heading 3">Success</Text>
          <BaseInput status="success" info="Success" value="Success" />
        </GridLayout.Column>
        <GridLayout.Column span={6}>
          <Text type="heading 3">Error</Text>
          <BaseInput status="error" info="Error" value="Error" />
        </GridLayout.Column>
        <GridLayout.Column span={6}>
          <Text type="heading 3">Disabled</Text>
          <BaseInput disabled value="Disabled" />
        </GridLayout.Column>
      </GridLayout>
    </BoxLayout>
  )
}

export const AddressInputComponent = () => {
  return (
    <BoxLayout>
      <GridLayout>
        <GridLayout.Column span={6}>
          <Text type="heading 3">Empty</Text>
          <AddressInput
            className="u-full-width"
            value=""
            networkName=""
            icon={undefined}
          />
        </GridLayout.Column>
        <GridLayout.Column span={6}>
          <Text type="heading 3">With value</Text>
          <AddressInput
            value="oxed139...862b"
            networkName="Polkadot.js"
            icon={{ name: 'dai', size: 30 }}
          />
        </GridLayout.Column>
        <GridLayout.Column span={6}>
          <Text type="heading 3">Error</Text>
          <AddressInput
            className="u-full-width"
            value=""
            networkName=""
            icon={undefined}
            status="error"
            error="Connect your wallet"
          />
        </GridLayout.Column>
      </GridLayout>
    </BoxLayout>
  )
}

BaseInputComponent.storyName = 'Base Input'
AddressInputComponent.storyName = 'Address Input'
