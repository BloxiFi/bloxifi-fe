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
    appereance: 'primary',
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

        <Button appereance="primary" variant="medium" size="medium" {...args}>
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

export const Appearance: ComponentStory<typeof Button> = () => (
  <GridLayout style={{ background: Colors.gray30, padding: 50 }}>
    <GridLayout.Column span={3}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Button</Text>

        <Button appereance="primary" variant="medium" size="medium">
          Button
        </Button>

        <Button appereance="primary" variant="medium" size="medium" disabled>
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={3}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Ghost</Text>

        <Button appereance="primary-ghost" variant="medium" size="medium">
          Button
        </Button>

        <Button
          appereance="primary-ghost"
          variant="medium"
          size="medium"
          disabled
        >
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={3}>
      <StackLayout gap={1}>
        <Text type="heading 3">Secondary Button</Text>

        <Button appereance="secondary" variant="medium" size="medium">
          Button
        </Button>

        <Button appereance="secondary" variant="medium" size="medium" disabled>
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={3}>
      <StackLayout gap={1}>
        <Text type="heading 3">Dark Button</Text>

        <Button appereance="dark" variant="medium" size="medium">
          Button
        </Button>

        <Button appereance="dark" variant="medium" size="medium" disabled>
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

        <Button appereance="primary" variant="thin" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Medium</Text>

        <Button appereance="primary" variant="medium" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Large</Text>

        <Button appereance="primary" variant="large" size="medium">
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

        <Button appereance="primary" variant="medium" size="small">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Medium</Text>

        <Button appereance="primary" variant="medium" size="medium">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Large</Text>

        <Button appereance="primary" variant="medium" size="large">
          Button
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Full width</Text>

        <Button
          appereance="primary"
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
          appereance="primary"
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
