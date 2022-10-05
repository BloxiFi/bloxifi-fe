import {
  ColumnLayout,
  ContentLoader,
  Icon,
  PageLayout,
  StackLayout,
  Text,
} from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { convertBalancesInUsdArray, sumArrayItems } from '@bloxifi/core'

import { DashboardContainer } from '@/containers/DashboardContainer'
import { FormattedNumber } from '@/components/borrow/FormattedNumber'

const DasboardInfo = () => {
  const { t } = useTranslation()
  const {
    state: { reserves, loading },
  } = DashboardContainer.useContainer()

  //Total deposited value converted in USD
  const totalDeposited = sumArrayItems(
    convertBalancesInUsdArray(reserves, 'totalATokenSupply'),
  )

  //Total borrowed value converted in USD
  const totalBorrowed = sumArrayItems(
    convertBalancesInUsdArray(reserves, 'totalCurrentVariableDebt'),
  )

  return (
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
  )
}
export default DasboardInfo
