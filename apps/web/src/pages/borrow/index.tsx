import React from 'react'
import { PageLayout } from '@bloxifi/ui'

import { WalletContainer } from '@/containers/WalletContainer'
import Borrow from '@/components/borrow'

const BorrowPage = () => {
  return (
    <PageLayout.Section>
      <WalletContainer.Provider>
        <Borrow />
      </WalletContainer.Provider>
    </PageLayout.Section>
  )
}
export default BorrowPage
