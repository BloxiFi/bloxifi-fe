import { CoverLayout, BoxLayout, Text } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'

import { StakeModalContent } from '@/components/staking/StakeModalContent'
import { ConnectWalletPaper } from '@/components/connector/ConnectWalletPaper'
import { UnstakeModalContent } from '@/components/staking/UnstakeModalContent'
import { Web3Container } from '@/containers/Web3Container'
import { ClaimRewards } from '@/components/staking/ClaimRewards'

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
          <GridLayout>
            <GridLayout.Column span={4}>
              <StakeModalContent />
            </GridLayout.Column>
            <GridLayout.Column span={4}>
              <UnstakeModalContent />
            </GridLayout.Column>
            <GridLayout.Column span={4}>
              <ClaimRewards />
            </GridLayout.Column>
          </GridLayout>
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
