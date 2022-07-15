import React, { useContext, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContext } from 'styled-components'

import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  ColumnLayout,
  Page,
  PageLayout,
  StackLayout,
  usePageLayout,
} from '../Layouts'
import { CellProps, Table } from '../Table'
import { Text } from '../Text'

export default {
  title: 'Showcases/Dashboard',
  component: Page,
}

const defaultColumns = {
  assets: {
    header: 'Assets',
    Cell: ({ data: { assets } }: CellProps) => <div>{assets}</div>,
    alignText: 'left',
  },
  totalValueDeposited: {
    header: 'Total value deposited',
    Cell: ({ data: { totalValueDeposited } }: CellProps) => (
      <span>{totalValueDeposited}</span>
    ),
  },
  totalBorrowed: {
    header: 'Total borrowed',
    Cell: ({ data: { totalBorrowed } }: CellProps) => (
      <span>{totalBorrowed}</span>
    ),
  },
  depositAPY: {
    header: 'Deposit APY',
    Cell: ({ data: { depositAPY } }: CellProps) => <span>{depositAPY}</span>,
  },
  borrowAPY: {
    header: 'Borrow APY',
    Cell: ({ data: { borrowAPY } }: CellProps) => <span>{borrowAPY}</span>,
    alignText: 'right',
  },
}

const defaultData = [
  {
    assets: 'ETH',
    totalValueDeposited: '1.250.000$',
    totalBorrowed: '1.250.000$',
    depositAPY: '3.5%',
    borrowAPY: '7.5%',
  },
  {
    assets: 'DAI',
    totalValueDeposited: '1.250.000$',
    totalBorrowed: '1.250.000$',
    depositAPY: '3.5%',
    borrowAPY: '7.5%',
  },
  {
    assets: 'POLKA',
    totalValueDeposited: '1.250.000$',
    totalBorrowed: '1.250.000$',
    depositAPY: '3.5%',
    borrowAPY: '7.5%',
  },
  {
    assets: 'BTC',
    totalValueDeposited: '1.250.000$',
    totalBorrowed: '1.250.000$',
    depositAPY: '3.5%',
    borrowAPY: '7.5%',
  },
]

export const Overview = args => {
  const nav = usePageLayout()
  const { setHeader } = nav
  const themeContext = useContext(ThemeContext)

  useEffect(() => {
    if (args.header) {
      setHeader(
        <PageLayout.Header
          navigationItems={[
            { to: '/', label: 'Dashboard' },
            { to: '/deposit', label: 'Deposit & Borrow' },
            { to: '/stake', label: 'Stake' },
            { to: '/moreInformation', label: 'More information' },
          ]}
        >
          <Button variant="medium" appearance="primary-ghost" size="medium">
            Blox Balance
          </Button>

          <Button variant="medium" appearance="primary" size="medium">
            Connect Wallet
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
          <StackLayout>
            <Text type="heading 1" color="white">
              Dashboard
            </Text>
          </StackLayout>
        </PageLayout.Section>
        <PageLayout.Section>
          <ColumnLayout gap={2}>
            <ColumnLayout>
              <ColumnLayout>
                <Icon
                  color={themeContext.tableBorderColor}
                  withBorder
                  size={53}
                  name="total-deposited"
                />
              </ColumnLayout>

              <ColumnLayout>
                <StackLayout gap={0.5}>
                  <Text color="white" as="span" type="body 2">
                    Total Deposited
                  </Text>
                  <Text color="white" as="span" type="body 4">
                    $100,000,000
                  </Text>
                </StackLayout>
              </ColumnLayout>
            </ColumnLayout>

            <ColumnLayout>
              <ColumnLayout>
                <Icon
                  color={themeContext.tableBorderColor}
                  withBorder
                  size={53}
                  name="total-borrowed"
                />
              </ColumnLayout>

              <ColumnLayout>
                <StackLayout gap={0.5}>
                  <Text color="white" as="span" type="body 2">
                    Total Borrowed
                  </Text>
                  <Text color="white" as="span" type="body 4">
                    $100,000,000
                  </Text>
                </StackLayout>
              </ColumnLayout>
            </ColumnLayout>
          </ColumnLayout>
        </PageLayout.Section>

        <PageLayout.Section>
          <Table columns={defaultColumns} data={defaultData} />
        </PageLayout.Section>
      </PageLayout>
    </BrowserRouter>
  )
}

Overview.args = { header: true }
