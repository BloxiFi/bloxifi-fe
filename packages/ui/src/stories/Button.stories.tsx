import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { StackLayout, Text } from '..'
import { Button } from '../Button'
import { GridLayout } from '../Layouts/GridLayout'
import { Colors } from '../styles/colors'

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    appearance: 'primary',
    variant: 'medium',
    size: 'medium',
    disabled: false,
  },
} as ComponentMeta<typeof Button>

export const Details: ComponentStory<typeof Button> = args => (
  <GridLayout>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Button</Text>

        <Button appearance="primary" variant="medium" size="medium" {...args}>
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

export const Appearance: ComponentStory<typeof Button> = () => (
  <GridLayout style={{ background: Colors.gray30, padding: 50 }}>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Button</Text>

        <Button appearance="primary" variant="medium" size="medium">
          Button
        </Button>

        <Button appearance="primary" variant="medium" size="medium" disabled>
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Ghost (Transparent)</Text>

        <Button appearance="primary-ghost" variant="medium" size="medium">
          Button
        </Button>

        <Button
          appearance="primary-ghost"
          variant="medium"
          size="medium"
          disabled
        >
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Secondary Button</Text>

        <Button appearance="secondary" variant="medium" size="medium">
          Button
        </Button>

        <Button appearance="secondary" variant="medium" size="medium" disabled>
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Dark Button</Text>

        <Button appearance="dark" variant="medium" size="medium">
          Button
        </Button>

        <Button appearance="dark" variant="medium" size="medium" disabled>
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Gradient Button</Text>

        <Button appearance="gradient" variant="medium" size="medium">
          Button
        </Button>

        <Button appearance="gradient" variant="medium" size="medium" disabled>
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

export const Variants: ComponentStory<typeof Button> = () => (
  <GridLayout>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Thin</Text>

        <Button appearance="primary" variant="thin" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Medium</Text>

        <Button appearance="primary" variant="medium" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Large</Text>

        <Button appearance="primary" variant="large" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

export const CustomSizes: ComponentStory<typeof Button> = () => (
  <GridLayout>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Small</Text>

        <Button appearance="primary" variant="medium" size="small">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Medium</Text>

        <Button appearance="primary" variant="medium" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Large</Text>

        <Button appearance="primary" variant="medium" size="large">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Full width</Text>

        <Button
          appearance="primary"
          variant="large"
          size="medium"
          className="u-full-width"
        >
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Fit content</Text>

        <Button
          appearance="primary"
          variant="large"
          size="medium"
          className="u-fit-content-width"
        >
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

Details.story = {
  name: 'Details',
}

Appearance.story = {
  name: 'Appearance',
}

Variants.story = {
  name: 'Variants',
}

CustomSizes.story = {
  name: 'Custom sizes',
}
