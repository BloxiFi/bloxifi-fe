import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Button } from '../Button'

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
      setHeader(
        <PageLayout.Header
          navigationItems={[
            { to: '/', label: 'Home' },
            { to: '/contact', label: 'Contact' },
          ]}
        >
          <Button variant="medium" appearance="primary" size="medium">
            Demo button
          </Button>
        </PageLayout.Header>,
      )
    } else {
      setHeader(null)
    }
  }, [args.header, setHeader])

  return (
    <BrowserRouter>
      <PageLayout {...nav}>
        <PageLayout.Section>
          <StackLayout center>Some Content</StackLayout>
        </PageLayout.Section>

        <PageLayout.Section>
          <StackLayout center>Some Content</StackLayout>
        </PageLayout.Section>
      </PageLayout>
    </BrowserRouter>
  )
}
