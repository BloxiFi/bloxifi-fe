import { Meta } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

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
import { Table, CellProps, stylings } from '../Table'
import { Text } from '../Text'
import { Toggle } from '../Toggle'
import { Icon } from '../Icon'
import {
  BorrowModal,
  DepositModal,
  RepayModal,
  WithdrawModal,
} from '../stories/Modal.stories'

export default {
  title: 'Showcases/Deposit and Borrow',
} as Meta

const getHeader = (isConnected = true) => (
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
    {isConnected ? (
      <Button appearance="primary-ghost" variant="medium" size="medium">
        <>
          Oxfd...586c
          <BoxLayout gap={0.75}>
            <Icon color="white" name="arrow-down" />
          </BoxLayout>
        </>
      </Button>
    ) : (
      <Button appearance="primary" variant="medium" size="medium">
        Connect wallet
      </Button>
    )}
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
    setHeader(getHeader(false))
  }, [setHeader])
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

export const Connected = args => {
  const nav = usePageLayout()
  const { setHeader } = nav

  useEffect(() => {
    setHeader(getHeader())
  }, [setHeader])

  const [isModalOpen, setIsModalOpen] = useState<
    'borrow' | 'deposit' | 'withdraw' | 'repay' | undefined
  >(undefined)
  const closeModal = () => setIsModalOpen(undefined)
  const isDepositEmpty = args.depositRows === 0
  const isBorrowEmpty = args.borrowRows === 0

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
          className="u-full-width"
        >
          Withdraw
        </Button>
      ),
      width: 160,
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
          className="u-full-width"
        >
          Repay
        </Button>
      ),
      width: 160,
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
      {!isDepositEmpty && (
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
      )}
    </StackLayout>
  )

  const BorrowTitleBox = () => (
    <ColumnLayout className={stylings.tableHeaderWithProgressBar}>
      <StackLayout gap={2.125}>
        <Text as="span" color="oxfordBlue" type="heading 2">
          Your borrow
        </Text>
        {!isBorrowEmpty && (
          <Text color="oxfordBlue" type="body 2" as="span">
            Balance $
            <Text as="span" color="oxfordBlue" bold>
              1.00
            </Text>
          </Text>
        )}
      </StackLayout>
      {!isBorrowEmpty && (
        <ProgressBar
          className={stylings.tableHeaderProgressBar}
          title="Borrowed"
          value={50}
          showBottomLabel
        />
      )}
    </ColumnLayout>
  )
  const initialRowData = {
    assets: 'Asset',
    balance: '1.00',
    APY: '0.50%',
  }
  const depositData = new Array(args.depositRows).fill(initialRowData)
  const borrowData = new Array(args.borrowRows).fill(initialRowData)

  return (
    <BrowserRouter>
      <PageLayout {...nav}>
        <PageLayout.Section>
          <GridLayout>
            <GridLayout.Column span={6}>
              <StackLayout gap={1.5}>
                <Table
                  columns={yourDepositColumns}
                  data={depositData}
                  noDataMessage="Nothing deposited yet"
                  titleComponent={<DepositTitleBox />}
                  footer={<BoxLayout gap={1} />}
                />
                <Table
                  columns={assetsToDepositColumns}
                  data={defaultData}
                  titleComponent="Assets to deposit"
                  columnSpacing
                />
              </StackLayout>
            </GridLayout.Column>
            <GridLayout.Column span={6}>
              <StackLayout gap={1.5}>
                <Table
                  columns={yourBorrowColumns}
                  data={borrowData}
                  noDataMessage="Nothing borrowed yet"
                  titleComponent={<BorrowTitleBox />}
                  footer={<BoxLayout gap={1} />}
                />
                <Table
                  columns={assetsToBorrowColumns}
                  data={defaultData}
                  titleComponent="Assets to borrow"
                  columnSpacing
                />
              </StackLayout>
            </GridLayout.Column>
          </GridLayout>
        </PageLayout.Section>
      </PageLayout>
      <DepositModal isOpen={isModalOpen === 'deposit'} onClose={closeModal} />
      <RepayModal isOpen={isModalOpen === 'repay'} onClose={closeModal} />
      <BorrowModal isOpen={isModalOpen === 'borrow'} onClose={closeModal} />
      <WithdrawModal isOpen={isModalOpen === 'withdraw'} onClose={closeModal} />
    </BrowserRouter>
  )
}

Connected.args = {
  depositRows: 3,
  borrowRows: 3,
}

NotConnected.storyName = 'Not Connected'
Connected.storyName = 'Connected'
