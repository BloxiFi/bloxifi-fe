import { GridLayout, PageLayout } from '@bloxifi/ui'
import React from 'react'

import { DashboardTable } from '@/components/dashboard/table/DashboardTable'
import DashboardInfo from '@/components/dashboard/DasboardInfo'
import { DashboardContainer } from '@/containers/DashboardContainer'
import { CalculatorApyTable } from '@/components/dashboard/table/CalculatorApyTable'

const DasboardPage = () => {
  return (
    <DashboardContainer.Provider>
      <DashboardInfo />

      <PageLayout.Section>
        <GridLayout>
          <GridLayout.Column span={6}>
            <CalculatorApyTable calctype="Deposit" />
          </GridLayout.Column>
          <GridLayout.Column span={6}>
            <CalculatorApyTable calctype="Borrow" />
          </GridLayout.Column>
        </GridLayout>
      </PageLayout.Section>

      <PageLayout.Section>
        <DashboardTable />
      </PageLayout.Section>
    </DashboardContainer.Provider>
  )
}
export default DasboardPage
