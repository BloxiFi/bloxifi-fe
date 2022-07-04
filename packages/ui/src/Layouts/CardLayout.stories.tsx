import React, { useEffect } from 'react'

import { Colors } from '../styles/colors'

import { Card, CardLayout } from './CardLayout'
import { CenterLayout } from './CenterLayout'
import { PageLayout, usePageLayout } from './PageLayout'
import { PageLayoutHeader } from './PageLayoutHeader'

export default {
  title: 'Layout/CardLayout',
  component: Card,
  argTypes: {
    border: {
      name: 'border',
      defaultValue: true,
    },
    borderColor: {
      name: 'borderColor',
      defaultValue: Colors.borderLight,
    },
    background: {
      name: 'background',
      defaultValue: '#fff',
    },
  },
}

export const Overview = args => {
  const nav = usePageLayout()

  useEffect(() => {
    if (args.header) {
      nav.setHeader(<PageLayout.Header>Header</PageLayout.Header>)
    } else {
      nav.setHeader(null)
    }
  }, [args.header, nav])

  return (
    <PageLayout {...nav}>
      <PageLayout.Section>
        <CenterLayout>
          <CardLayout
            style={{ height: 300, width: 250, textAlign: 'center' }}
            {...args}
          >
            <p>Lorem ipsum dolor sit amet</p>
          </CardLayout>
        </CenterLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

Overview.story = {
  name: 'Overview',
}
