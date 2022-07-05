import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { CellProps, Table } from '../Table'

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    controls: {
      exclude: /.*/s,
    },
  },
} as Meta

export const defaultColumns = {
  assets: {
    header: 'Assets',
    Cell: ({ data: { assets } }: CellProps) => (
      <WrappedText>{assets}</WrappedText>
    ),
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

export const defaultData = [
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

export const EmptyDataTable: React.FC = () => (
  <Table
    noDataMessage="There is no data loaded."
    columns={defaultColumns}
    data={[]}
  />
)

export const BasicTable = () => (
  <Table columns={defaultColumns} data={defaultData} />
)

export const TitleAsPlainText = () => (
  <Table
    columns={defaultColumns}
    data={defaultData}
    titleComponent="Assets to deposit"
  />
)

export const TitleAsComponent = () => {
  const ComponentTitle = () => <div>Your deposit</div>

  return (
    <Table
      columns={defaultColumns}
      data={defaultData}
      titleComponent={<ComponentTitle />}
    />
  )
}

export const WithFooter = () => {
  const FooterComponent = () => <div>Footer component</div>

  return (
    <Table
      columns={defaultColumns}
      data={defaultData}
      footer={<FooterComponent />}
    />
  )
}

export const ExpandableTable = () => {
  const columns = {
    ...defaultColumns,
    action: {
      header: 'Action',
      Cell: ({ onRowExpand }: CellProps) => {
        const [isExpanded, setIsExpanded] = useState<boolean>(false)
        const onExpand = () => {
          setIsExpanded(!isExpanded)
          onRowExpand(!isExpanded)
        }

        return (
          <Button
            appearance="primary"
            variant="thin"
            size="small"
            onClick={() => onExpand()}
          >
            {isExpanded ? 'Close' : 'Expand'}
          </Button>
        )
      },
      ExpandedCell: () => {
        return <ExpandedRow>Expanded row</ExpandedRow>
      },
      width: 100,
    },
  }

  return <Table columns={columns} data={defaultData} />
}

ExpandableTable.storyName = 'Expandable table'

const WrappedText = styled.div`
  word-break: break-all;
`

const ExpandedRow = styled.div`
  background: ${({ theme }) => theme.darkBackground};
  display: flex;
  flex-direction: column;
  padding: 1rem 1.4rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`
