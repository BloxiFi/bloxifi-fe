import { ColumnLayout, Icon, PageLayout, StackLayout, Text } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DashboardTable } from '@/components/dashboard/table/DashboardTable'
import { WalletContainer } from '@/containers/WalletContainer'

const DasboardPage = () => {
  const { t } = useTranslation()
  const {
    state: { reserves },
  } = WalletContainer.useContainer()

  //TODO LOADER COMPONENT loader={<Loader loaderSize={size} />}
  //TODO DISPLAYING ERROR MESSAGES

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
                $100,000,000
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
                $100,000,000
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
