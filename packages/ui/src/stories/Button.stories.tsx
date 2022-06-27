import { ComponentMeta, ComponentStory } from '@storybook/react'
import { styled } from '@storybook/theming'
import React from 'react'

import { StackLayout, Text, BoxLayout } from '..'
import { Button } from '../Button'
import { Icon } from '../Icon'
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
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Text Button default</Text>

        <Button
          appearance="text"
          variant="medium"
          size="medium"
          className="u-fit-content-width"
        >
          Button
        </Button>

        <Button
          appearance="text"
          variant="medium"
          size="medium"
          disabled
          className="u-fit-content-width"
        >
          Disabled
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Text Button custom color</Text>

        <Button
          appearance="text"
          variant="medium"
          size="medium"
          className="u-fit-content-width"
          color="red"
        >
          Button
        </Button>

        <Button
          appearance="text"
          variant="medium"
          size="medium"
          disabled
          className="u-fit-content-width"
          color="red"
        >
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

export const IconButton: ComponentStory<typeof Button> = () => (
  <GridLayout style={{ background: Colors.gray30, padding: 50 }}>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Button</Text>
        <Wrapper>
          <Button
            appearance="primary"
            variant="large"
            size="large"
            icon="settings"
          />

          <Button
            appearance="primary"
            variant="medium"
            size="medium"
            icon="settings"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Ghost (Transparent)</Text>
        <Wrapper>
          <Button
            appearance="primary-ghost"
            variant="large"
            size="large"
            icon="settings"
          />
          <Button
            appearance="primary-ghost"
            variant="medium"
            size="medium"
            icon="settings"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Secondary Button</Text>
        <Wrapper>
          <Button
            appearance="secondary"
            variant="large"
            size="large"
            icon="settings"
          />
          <Button
            appearance="secondary"
            variant="medium"
            size="medium"
            icon="settings"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Dark Button</Text>
        <Wrapper>
          <Button
            appearance="dark"
            variant="large"
            size="large"
            icon="settings"
          />
          <Button
            appearance="dark"
            variant="medium"
            size="medium"
            icon="settings"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Gradient Button</Text>
        <Wrapper>
          <Button
            appearance="gradient"
            variant="large"
            size="large"
            icon="settings"
          />
          <Button
            appearance="gradient"
            variant="medium"
            size="medium"
            icon="settings"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Text Button default</Text>
        <Wrapper>
          <Button
            appearance="text"
            variant="large"
            size="large"
            icon="settings"
          />
          <Button
            appearance="text"
            variant="medium"
            size="medium"
            icon="settings"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Text Button custom color</Text>
        <Wrapper>
          <Button
            appearance="text"
            variant="large"
            size="large"
            icon="settings"
            color="red"
          />
          <Button
            appearance="text"
            variant="medium"
            size="medium"
            icon="settings"
            color="red"
          />
        </Wrapper>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

export const IconTextButton: ComponentStory<typeof Button> = () => (
  <GridLayout style={{ background: Colors.gray30, padding: 50 }}>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Button</Text>
        <Button appearance="primary" variant="medium" size="medium">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button appearance="primary" variant="medium" size="medium" disabled>
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>

    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Primary Ghost (Transparent)</Text>
        <Button appearance="primary-ghost" variant="medium" size="medium">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button
          appearance="primary-ghost"
          variant="medium"
          size="medium"
          disabled
        >
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Secondary Button</Text>
        <Button appearance="secondary" variant="medium" size="medium">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button appearance="secondary" variant="medium" size="medium" disabled>
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Dark Button</Text>
        <Button appearance="dark" variant="medium" size="medium">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button appearance="dark" variant="medium" size="medium" disabled>
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Gradient Button</Text>
        <Button appearance="gradient" variant="medium" size="medium">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button appearance="gradient" variant="medium" size="medium" disabled>
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="white" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Text Button default</Text>
        <Button appearance="text" variant="medium" size="medium">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button appearance="text" variant="medium" size="medium" disabled>
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <StackLayout gap={1}>
        <Text type="heading 3">Text Button custom color</Text>
        <Button appearance="text" variant="medium" size="medium" color="red">
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="red" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>

        <Button
          appearance="text"
          variant="medium"
          size="medium"
          color="red"
          disabled
        >
          <>
            Oxfd...586c
            <BoxLayout gap={0.75}>
              <Icon color="red" name="arrow-down" />
            </BoxLayout>
          </>
        </Button>
      </StackLayout>
    </GridLayout.Column>
  </GridLayout>
)

Details.storyName = 'Details'
Appearance.storyName = 'Appearance'
Variants.storyName = 'Variants'
CustomSizes.storyName = 'CustomSizes'
IconButton.storyName = 'Icon'
IconTextButton.storyName = 'Text with Icon'

const Wrapper = styled(GridLayout.Column)`
  & > * {
    margin-right: 20px;
  }
`
