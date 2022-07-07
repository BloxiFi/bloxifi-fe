import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { Page, PageLayout, usePageLayout } from '../Layouts'
import { GridLayout } from '../Layouts/GridLayout'
import { Table } from '../Table'
import { Text } from '../Text'

import { defaultColumns, defaultData } from './Table.stories'

export default {
  title: 'Showcases/Dashboard',
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
          <Header type="heading 1" color="white">
            Dashboard
          </Header>

          <GridLayout>
            <GridLayout.Column span={3}>
              <DepositInfoWrapper>
                <Icon size={50} name="total-deposited" />

                <DepositAmountWrapper>
                  <Text type="body 2">Total Deposited</Text>
                  <Text type="body 4">$100,000,000</Text>
                </DepositAmountWrapper>
              </DepositInfoWrapper>
            </GridLayout.Column>

            <GridLayout.Column span={3}>
              <DepositInfoWrapper>
                <Icon size={50} name="total-borrowed" />

                <DepositAmountWrapper>
                  <Text type="body 2">Total Borrowed</Text>
                  <Text type="body 4">$100,000,000</Text>
                </DepositAmountWrapper>
              </DepositInfoWrapper>
            </GridLayout.Column>
          </GridLayout>
        </PageLayout.Section>

        <PageLayout.Section>
          <Table columns={defaultColumns} data={defaultData} />
        </PageLayout.Section>
      </PageLayout>
    </BrowserRouter>
  )
}

const DepositInfoWrapper = styled.div`
  color: white;
  display: flex;
  align-items: stretch;
  justify-content: space-between;

  & svg {
    width: 50px;
    height: 50px;
    border: 0.5px solid ${({ theme }) => theme.borderColor};
    border-radius: 10px;
    padding: 4px;
    fill: white;
  }

  & p {
    color: white;
    margin: 0;
    line-height: 1;
  }
`

const DepositAmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`
const Header = styled(Text)`
  margin: 0 0 52px;
  line-height: 1;
`
