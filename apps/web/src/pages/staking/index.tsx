import { CoverLayout, BoxLayout, Text } from '@bloxifi/ui'
import React from 'react'
import { useContainer } from 'unstated-next'

import { StakeModalContent } from '@/components/Staking/StakeModalContent'
import { ConnectWalletPaper } from '@/components/WalletConnection/ConnectWalletPaper'
import { Web3Container } from '@/containers/Web3Container'

const StakingPage = () => {
  const {
    state: { connected, loading },
  } = useContainer(Web3Container)
  return (
    <BoxLayout>
      <Text type="heading 2" semiBold>
        Staking page
      </Text>

      <CoverLayout>
        {connected ? (
          <StakeModalContent />
        ) : (
          <ConnectWalletPaper
            loading={loading}
            description="We couldn’t detect a wallet. Connect a wallet to stake."
          />
        )}
      </CoverLayout>
    </BoxLayout>
  )
}
export default StakingPage
