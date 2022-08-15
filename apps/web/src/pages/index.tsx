import {
  CellProps,
  ColumnLayout,
  Icon,
  PageLayout,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Web3Container } from '@/containers/Web3Container'

const HomePage = () => {
  const { t } = useTranslation()
  const {
    state: { isConnected, loading },
  } = Web3Container.useContainer()

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
    },
  }

  return (
    <>
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
            <Icon color="white" withBorder size={53} name="total-deposited" />

            <StackLayout gap={0.5}>
              <Text color="white" as="span" type="body 2">
                Total Deposited
              </Text>
              <Text color="white" as="span" type="body 4">
                $100,000,000
              </Text>
            </StackLayout>
          </ColumnLayout>

          <ColumnLayout>
            <Icon color="white" withBorder size={53} name="total-borrowed" />

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
      </PageLayout.Section>

      <PageLayout.Section>
        <Table columnSpacing headerSpacing columns={defaultColumns} data={[]} />
      </PageLayout.Section>
    </>
  )
}
export default HomePage

const Wrapper = styled.body`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
