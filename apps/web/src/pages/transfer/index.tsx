import React, { useEffect } from 'react'
import { PageLayout } from '@bloxifi/ui'
import { useNavigate } from 'react-router-dom'
import { hasTokenTransfer } from '@bloxifi/core'

import TokenTransfer from '@/components/transfer'

const TokenTransferPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasTokenTransfer) {
      navigate('/')
    }
  }, [navigate])

  return (
    <PageLayout.Section>
      <TokenTransfer />
    </PageLayout.Section>
  )
}
export default TokenTransferPage
