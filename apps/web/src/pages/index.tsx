import { PageLayout } from '@bloxifi/ui'
import React from 'react'

import { DashboardTable } from '@/components/dashboard/table/DashboardTable'
import DashboardInfo from '@/components/dashboard/DasboardInfo'
import { DashboardContainer } from '@/containers/DashboardContainer'

const DasboardPage = () => {
  return (
    <DashboardContainer.Provider>
      <DashboardInfo />

      <PageLayout.Section>
        <DashboardTable />
      </PageLayout.Section>
    </DashboardContainer.Provider>
  )
}
export default DasboardPage
