import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Button } from '../Button'

import {
  PageLayout,
  Page,
  usePageLayout,
  HeaderLink,
  HeaderExternalLink,
} from './PageLayout'
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
      const GITBOOK_URL = process.env.GITBOOK_URL
      setHeader(
        <PageLayout.Header
          navigationItems={[
            <HeaderLink data-cy="Dashboard" key="/" to="/">
              Dashboard
            </HeaderLink>,
            <HeaderLink
              data-cy="Deposit &amp; Borrow"
              key="/borrow"
              to="/borrow"
            >
              Deposit &amp; Borrow
            </HeaderLink>,
            <HeaderExternalLink
              data-cy="More information"
              key="/information"
              href={GITBOOK_URL}
              target="_blank"
            >
              More information
            </HeaderExternalLink>,
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
