import { Meta } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '../Button'
import {
  PageLayout,
  usePageLayout,
  StackLayout,
  CenterLayout,
  CardLayout,
  BoxLayout,
  ColumnLayout,
} from '../Layouts'
import { GridLayout } from '../Layouts/GridLayout'
import { ProgressBar } from '../ProgressBar'
import { Table, CellProps } from '../Table'
import { Text } from '../Text'
import { Toggle } from '../Toggle'
import { Icon } from '../Icon'

export default {
  title: 'showcase/Deposit and Borrow',
} as Meta

const getHeader = () => (
  <PageLayout.Header
    navigationItems={[
      { to: '/', label: 'Dashboard' },
      { to: '/', label: 'Deposit&Borrow' },
      { to: '/', label: 'Stake' },
      { to: '/', label: 'More Information' },
    ]}
  >
    <Button variant="medium" appearance="primary-ghost" size="medium">
      Blox Balance
    </Button>
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
      icon="settings"
    />
  </PageLayout.Header>
)

export const NotConnected = () => {
  const nav = usePageLayout()
  const { setHeader } = nav

  useEffect(() => {
    setHeader(getHeader())
  }, [])
  return (
    <BrowserRouter>
      <PageLayout {...nav}>
        <PageLayout.Section>
          <StackLayout center>
            <GridLayout>
              <GridLayout.Column span={6}>
                <CardLayout>
                  <BoxLayout gap={2}>
                    <StackLayout gap={2.815}>
                      <Text as="span" color="oxfordBlue" type="heading 2">
                        Your deposit
                      </Text>
                      <Text type="body 5">Nothing deposited yet</Text>
                    </StackLayout>
                  </BoxLayout>
                </CardLayout>
              </GridLayout.Column>
              <GridLayout.Column span={6}>
                <CardLayout>
                  <BoxLayout gap={2}>
                    <StackLayout gap={2.815}>
                      <Text as="span" color="oxfordBlue" type="heading 2">
                        Your borrow
                      </Text>
                      <Text type="body 5">Nothing borrowed yet</Text>
                    </StackLayout>
                  </BoxLayout>
                </CardLayout>
              </GridLayout.Column>
              <GridLayout.Column span={12}>
                <CardLayout>
                  <BoxLayout gap={8}>
                    <CenterLayout>
                      <Text as="span" color="oxfordBlue" type="heading 2">
                        Please, connect your wallet
                      </Text>
                      <Text color="oxfordBlue" type="body 5">
                        Please, connect your wallet to see your deposits and
                        borrowings
                      </Text>
                      <Button
                        appearance="primary"
                        size="medium"
                        variant="medium"
                      >
                        Connect wallet
                      </Button>
                    </CenterLayout>
                  </BoxLayout>
                </CardLayout>
              </GridLayout.Column>
            </GridLayout>
          </StackLayout>
        </PageLayout.Section>
      </PageLayout>
    </BrowserRouter>
  )
}

export const Completed = () => {
  const nav = usePageLayout()
  const { setHeader } = nav

  useEffect(() => {
    setHeader(getHeader())
  }, [])

  const [isModalOpen, setIsModalOpen] = useState<
    'borrow' | 'deposit' | 'withdraw' | 'repay' | undefined
  >(undefined)
  const closeModal = () => setIsModalOpen(undefined)

  const yourDepositColumns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { assets } }: CellProps) => <span>{assets}</span>,
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { balance } }: CellProps) => <span>{balance}</span>,
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { APY } }: CellProps) => <span>{APY}</span>,
      alignText: 'left',
    },

    collateral: {
      header: 'Collateral',
      Cell: () => <Toggle />,
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          onClick={() => setIsModalOpen('withdraw')}
        >
          Withdraw
        </Button>
      ),
      width: 100,
    },
  }

  const yourBorrowColumns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { assets } }: CellProps) => <span>{assets}</span>,
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { balance } }: CellProps) => <span>{balance}</span>,
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { APY } }: CellProps) => <span>{APY}</span>,
      alignText: 'left',
    },
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          onClick={() => setIsModalOpen('repay')}
        >
          Repay
        </Button>
      ),
      width: 100,
    },
  }
  const defaultColumns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { assets } }: CellProps) => <span>{assets}</span>,
      alignText: 'left',
    },
    walletBalance: {
      header: 'Wallet balance',
      Cell: ({ data: { walletBalance } }: CellProps) => (
        <span>{walletBalance}</span>
      ),
      alignText: 'center',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { APY } }: CellProps) => <span>{APY}</span>,
      alignText: 'center',
    },
  }

  const assetsToDepositColumns = {
    ...defaultColumns,
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="medium"
          size="small"
          onClick={() => setIsModalOpen('deposit')}
        >
          Deposit
        </Button>
      ),
      width: 100,
    },
  }

  const assetsToBorrowColumns = {
    ...defaultColumns,
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="medium"
          size="small"
          onClick={() => setIsModalOpen('borrow')}
        >
          Borrow
        </Button>
      ),
      width: 100,
    },
  }

  const defaultData = [
    {
      assets: 'ETH',
      walletBalance: '1.250.000$',
      APY: '3.5%',
    },
    {
      assets: 'DAI',
      walletBalance: '1.250.000$',
      APY: '3.5%',
    },
    {
      assets: 'POLKA',
      walletBalance: '1.250.000$',
      APY: '3.5%',
    },
    {
      assets: 'BTC',
      walletBalance: '1.250.000$',
      APY: '3.5%',
    },
  ]
  const DepositTitleBox = () => (
    <StackLayout gap={2.125}>
      <Text as="span" color="oxfordBlue" type="heading 2">
        Your deposit
      </Text>
      <ColumnLayout center gap={1}>
        <Text color="oxfordBlue" as="span" type="body 2">
          Balance $
          <Text as="span" color="oxfordBlue" bold>
            1.00
          </Text>
        </Text>

        <Text color="oxfordBlue" as="span" type="body 2">
          Collateral $
          <Text as="span" color="oxfordBlue" bold>
            1.00
          </Text>
        </Text>
      </ColumnLayout>
    </StackLayout>
  )

  const BorrowTitleBox = () => (
    <BorrowColumn>
      <StackLayout gap={2.125}>
        <Text as="span" color="oxfordBlue" type="heading 2">
          Your borrow
        </Text>

        <Text color="oxfordBlue" type="body 2" as="span">
          Balance $
          <Text as="span" color="oxfordBlue" bold>
            1.00
          </Text>
        </Text>
      </StackLayout>
      <ProgressBarWrapper>
        <ProgressBar title="Borrowed" value={50} showBottomLabel />
      </ProgressBarWrapper>
    </BorrowColumn>
  )

  return (
    <BrowserRouter>
      <PageLayout {...nav}>
        <PageLayout.Section>
          <StackLayout center gap={1}>
            <GridLayout>
              <GridLayout.Column span={6}>
                <CardLayout>
                  <Table
                    columns={yourDepositColumns}
                    data={[
                      {
                        assets: 'Asset',
                        balance: '1.00',
                        APY: '0.50%',
                      },
                    ]}
                    titleComponent={<DepositTitleBox />}
                  />
                </CardLayout>
              </GridLayout.Column>
              <GridLayout.Column span={6}>
                <CardLayout>
                  <Table
                    columns={yourBorrowColumns}
                    data={[
                      {
                        assets: 'Asset',
                        balance: '1.00',
                        APY: '0.50%',
                      },
                    ]}
                    titleComponent={<BorrowTitleBox />}
                  />
                </CardLayout>
              </GridLayout.Column>
              <GridLayout.Column span={6}>
                <CardLayout>
                  <Table
                    columns={assetsToDepositColumns}
                    data={defaultData}
                    titleComponent="Assets to deposit"
                  />
                </CardLayout>
              </GridLayout.Column>

              <GridLayout.Column span={6}>
                <CardLayout>
                  <Table
                    columns={assetsToBorrowColumns}
                    data={defaultData}
                    titleComponent="Assets to borrow"
                  />
                </CardLayout>
              </GridLayout.Column>
            </GridLayout>
          </StackLayout>
        </PageLayout.Section>
      </PageLayout>
    </BrowserRouter>
  )
}

const BorrowColumn = styled(ColumnLayout)`
  position: relative;
`
const ProgressBarWrapper = styled.div`
  position: absolute;
  bottom: -20px;
  right: 0;
  width: 50%;
`

NotConnected.storyName = 'Not Connected'
Completed.storyName = 'Completed'
