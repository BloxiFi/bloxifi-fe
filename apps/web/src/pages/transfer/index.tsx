import React from 'react'
import { PageLayout } from '@bloxifi/ui'
import { Navigate } from 'react-router-dom'
import { hasTokenTransfer } from '@bloxifi/core'

import TokenTransfer from '@/components/transfer'

const TokenTransferPage = () => {
  return hasTokenTransfer ? (
    <PageLayout.Section>
      <TokenTransfer />
    </PageLayout.Section>
  ) : (
    <Navigate to="/" />
  )
}
export default TokenTransferPage
