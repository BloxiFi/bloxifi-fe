import React from 'react'
import {
  BoxLayout,
  CardLayout,
  GridLayout,
  PageLayout,
  StackLayout,
  Table,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { Web3Container } from '@/containers/Web3Container'
import { WalletContainer } from '@/containers/WalletContainer'
import { ConnectionStatus } from '@/components/borrow/ConnectionStatus'
import { AvailableToBorrowTable } from '@/components/borrow/table/AvailableToBorrowTable'
import { AvaliableToDepositTable } from '@/components/borrow/table/AvaliableToDepositTable'
import { YourDepositsTable } from '@/components/borrow/table/YourDepositsTable'
import { YourBorrowsTable } from '@/components/borrow/table/YourBorrowsTable'

const BorrowPage = () => {
  const {
    state: {
      isConnected,
      loading: connectionLoading,
      isSupportedNetwork,
      isMetamaskInstalled,
    },
  } = Web3Container.useContainer()
  const {
    state: { error },
  } = WalletContainer.useContainer()
  const { t } = useTranslation()

  return (
    <PageLayout.Section>
      {isMetamaskInstalled &&
      isSupportedNetwork &&
      !connectionLoading &&
      !error &&
      isConnected ? (
        <GridLayout>
          <GridLayout.Column span={6}>
            <StackLayout gap={1.5}>
              <YourDepositsTable />
              <AvaliableToDepositTable />
            </StackLayout>
          </GridLayout.Column>
          <GridLayout.Column span={6}>
            <StackLayout gap={1.5}>
              <YourBorrowsTable />
              <AvailableToBorrowTable />
            </StackLayout>
          </GridLayout.Column>
        </GridLayout>
      ) : (
        <GridLayout>
          <GridLayout.Column span={6}>
            <CardLayout>
              <Table
                columns={{}}
                data={[]}
                noDataMessage={t('deposit.depositEmpty')}
                titleComponent={t('deposit.yourDeposit')}
                footer={<BoxLayout gap={1} />}
              />
            </CardLayout>
          </GridLayout.Column>
          <GridLayout.Column span={6}>
            <CardLayout>
              <Table
                columns={{}}
                data={[]}
                noDataMessage={t('deposit.borrowEmpty')}
                titleComponent={t('deposit.yourBorrow')}
                footer={<BoxLayout gap={1} />}
              />
            </CardLayout>
          </GridLayout.Column>
          <ConnectionStatus />
        </GridLayout>
      )}
    </PageLayout.Section>
  )
}
export default BorrowPage
