import React, { useEffect } from 'react'
import { PageLayout } from '@bloxifi/ui'
import { useNavigate } from 'react-router-dom'

import TokenTransfer from '@/components/transfer'

const hasTokenTransfer = process.env.FEATURE_TOKEN_TRANSFER

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
