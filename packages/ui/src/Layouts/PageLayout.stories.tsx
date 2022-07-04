import React, { useEffect } from 'react'

import { PageLayout, Page, usePageLayout } from './PageLayout'
import { StackLayout } from './StackLayout'

export default {
  title: 'Layout/PageLayout',
  component: Page,
  argTypes: {
    header: {
      defaultValue: true,
      control: 'boolean',
    },
  },
}

export const Overview = args => {
  const nav = usePageLayout()
  const { setHeader } = nav

  useEffect(() => {
    if (args.header) {
      setHeader(<PageLayout.Header>Header</PageLayout.Header>)
    } else {
      setHeader(null)
    }
  }, [args.header, setHeader])

  return (
    <PageLayout {...nav}>
      <PageLayout.Section>
        <StackLayout center>Some Content</StackLayout>
      </PageLayout.Section>

      <PageLayout.Section>
        <StackLayout center>Some Content</StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}
