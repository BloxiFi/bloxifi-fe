//TODO COMPLETE FETCHING & DISPLAYING DATA
import { BoxLayout, Button, CellProps, Table } from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { BorrowTitleBox } from './BorrowTitleBox'

export const YourBorrowsTable: FunctionComponent = () => {
  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data }: CellProps) => <span>asset</span>,
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data }: CellProps) => <span>11</span>,
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data }: CellProps) => <span>APY</span>,
      alignText: 'left',
    },
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          className="u-full-width"
        >
          Repay
        </Button>
      ),
      width: 160,
    },
  }

  return (
    <Table
      columns={columns}
      data={[]}
      noDataMessage="Nothing borrowed yet"
      titleComponent={<BorrowTitleBox isEmpty={true} />}
      footer={<BoxLayout gap={1} />}
    />
  )
}
