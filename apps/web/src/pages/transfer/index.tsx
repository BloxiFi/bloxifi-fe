import React, { useEffect } from 'react'
import { PageLayout } from '@bloxifi/ui'
import { useNavigate } from 'react-router-dom'

import TokenTransfer from '@/components/transfer'

const isTestNet = process.env.IS_TESTNET

const TokenTransferPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isTestNet) {
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
