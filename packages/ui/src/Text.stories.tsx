import { Meta } from '@storybook/react'
import React from 'react'

import { StackLayout } from './Layouts'
import { Text } from './Text'

export default {
  title: 'Text',
  component: Text,
} as Meta

export const headings = args => (
  <StackLayout gap={2}>
    <Text type="heading 1" {...args}>
      Heading 1
    </Text>
    <Text type="heading 2" {...args}>
      Heading 2
    </Text>
    <Text type="heading 3" {...args}>
      Heading 3
    </Text>
  </StackLayout>
)

export const paragraphs = args => (
  <StackLayout gap={2}>
    <Text type="body 1" {...args}>
      Body 1
    </Text>
    <Text type="body 2" {...args}>
      Body 2
    </Text>
    <Text type="body 3" {...args}>
      Body 3
    </Text>
    <Text type="body 4" {...args}>
      Body 4
    </Text>
    <Text type="body 5" {...args}>
      Body 5
    </Text>
    <Text type="small-text" color="textColorDark" {...args}>
      Small text
    </Text>
  </StackLayout>
)

headings.story = {
  name: 'Headings',
}

paragraphs.story = {
  name: 'Paragraphs',
}
