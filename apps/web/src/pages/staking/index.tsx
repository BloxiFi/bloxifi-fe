import { CoverLayout, BoxLayout, Text } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { StakeModalContent } from '@/components/Staking/StakeModalContent'
import { ConnectWalletPaper } from '@/components/WalletConnection/ConnectWalletPaper'
import { Web3Container } from '@/containers/Web3Container'

const StakingPage = () => {
  const {
    state: { isConnected, loading },
  } = Web3Container.useContainer()
  const { t } = useTranslation()

  return (
    <BoxLayout>
      <Text type="heading 2" semiBold>
        Staking page
      </Text>

      <CoverLayout>
        {isConnected ? (
          <StakeModalContent />
        ) : (
          <ConnectWalletPaper loading={loading}>
            {t('staking.notConnectedMessage')}
          </ConnectWalletPaper>
        )}
      </CoverLayout>
    </BoxLayout>
  )
}
export default StakingPage
