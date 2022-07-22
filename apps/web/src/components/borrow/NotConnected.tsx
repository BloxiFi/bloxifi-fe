import React, { FunctionComponent } from 'react'
import {
  BoxLayout,
  Button,
  CardLayout,
  CenterLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'

import { Web3Container } from '@/containers/Web3Container'

export const NotConnected: FunctionComponent = () => {
  const { connectWallet } = Web3Container.useContainer()

  return (
    <GridLayout>
      <GridLayout.Column span={6}>
        <CardLayout>
          <Table
            columns={{}}
            data={[]}
            noDataMessage="Nothing deposited yet"
            titleComponent="Your Deposit"
            footer={<BoxLayout gap={1} />}
          />
        </CardLayout>
      </GridLayout.Column>
      <GridLayout.Column span={6}>
        <CardLayout>
          <Table
            columns={{}}
            data={[]}
            noDataMessage="Nothing borrowed yet"
            titleComponent="Your Borrow"
            footer={<BoxLayout gap={1} />}
          />
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
                Please, connect your wallet to see your deposits and borrowings
              </Text>
              <Button
                appearance="primary"
                size="medium"
                variant="medium"
                onClick={connectWallet}
              >
                Connect wallet
              </Button>
            </CenterLayout>
          </BoxLayout>
        </CardLayout>
      </GridLayout.Column>
    </GridLayout>
  )
}
