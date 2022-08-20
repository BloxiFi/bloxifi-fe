import {
  ColumnLayout,
  ContentLoader,
  CoverLayout,
  Icon,
  Loader,
  PageLayout,
  StackLayout,
  Text,
} from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { convertBalancesInUsdArray, sumArrayItems } from '@bloxifi/core'

import { DashboardTable } from '@/components/dashboard/table/DashboardTable'
import { WalletContainer } from '@/containers/WalletContainer'
import { FormattedNumber } from '@/components/borrow/FormattedNumber'
import { Web3Container } from '@/containers/Web3Container'

const DasboardPage = () => {
  const { t } = useTranslation()
  const {
    state: { loading: connectionLoading },
  } = Web3Container.useContainer()
  const {
    state: { reserves, loading },
  } = WalletContainer.useContainer()

  if (connectionLoading) {
    return (
      <CoverLayout>
        <Loader />
      </CoverLayout>
    )
  }
  //TODO LOADER COMPONENT loader={<Loader loaderSize={size} />}
  //TODO DISPLAYING ERROR MESSAGES

  //Total deposited value converted in USD
  const totalDeposited = sumArrayItems(
    convertBalancesInUsdArray(reserves, 'totalATokenSupply'),
  )

  //Total borrowed value converted in USD
  const totalBorrowed = sumArrayItems(
    convertBalancesInUsdArray(reserves, 'totalCurrentVariableDebt'),
  )

  return (
    <>
      <PageLayout.Section>
        <StackLayout>
          <Text type="heading 1" color="white">
            {t('dashboard.pageTitle')}
          </Text>
        </StackLayout>
      </PageLayout.Section>
      <PageLayout.Section>
        <ColumnLayout gap={2}>
          <ColumnLayout>
            <Icon color="white" withBorder size={53} name="total-deposited" />

            <StackLayout gap={0.5}>
              <Text color="white" as="span" type="body 2">
                {t('dashboard.totalDeposited')}
              </Text>
              <Text color="white" as="span" type="body 4">
                {loading ? (
                  <ContentLoader />
                ) : (
                  <FormattedNumber
                    value={totalDeposited}
                    symbol="USD"
                    symbolPosition="before"
                  />
                )}
              </Text>
            </StackLayout>
          </ColumnLayout>

          <ColumnLayout>
            <Icon color="white" withBorder size={53} name="total-borrowed" />

            <StackLayout gap={0.5}>
              <Text color="white" as="span" type="body 2">
                {t('dashboard.totalBorrowed')}
              </Text>
              <Text color="white" as="span" type="body 4">
                {loading ? (
                  <ContentLoader />
                ) : (
                  <FormattedNumber
                    value={totalBorrowed}
                    symbol="USD"
                    symbolPosition="before"
                  />
                )}
              </Text>
            </StackLayout>
          </ColumnLayout>
        </ColumnLayout>
      </PageLayout.Section>

      <PageLayout.Section>
        <DashboardTable />
      </PageLayout.Section>
    </>
  )
}
export default DasboardPage
