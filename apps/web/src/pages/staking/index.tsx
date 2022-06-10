import { CoverLayout, BoxLayout, Text } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'

import { StakeModalContent } from '@/components/Staking/StakeModalContent'
import { ConnectWalletPaper } from '@/components/WalletConnection/ConnectWalletPaper'
import { UnstakeModalContent } from '@/components/Staking/UnstakeModalContent'
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
          <GridLayout>
            <GridLayout.Column span={6}>
              <StakeModalContent />
            </GridLayout.Column>
            <GridLayout.Column span={6}>
              <UnstakeModalContent />
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
