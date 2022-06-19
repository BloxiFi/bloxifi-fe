import { CoverLayout, BoxLayout, Text } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'

import { ConnectWalletPaper } from '@/components/WalletConnection/ConnectWalletPaper'
import { Web3Container } from '@/containers/Web3Container'
import { DepositModalContent } from '@/components/Deposit/DepositModalContent'
import AssetList from '@/components/Deposit/AssetList'
import { DepositContainer } from '@/containers/DepositContainer'

const DepositPage = () => {
  const {
    state: { isConnected, loading },
  } = Web3Container.useContainer()
  const { t } = useTranslation()

  return (
    <DepositContainer.Provider>
      <BoxLayout>
        <Text type="heading 2" semiBold>
          {t('deposit.pageTitle')}
        </Text>

        <CoverLayout>
          {isConnected ? (
            <GridLayout>
              <GridLayout.Column span={6}>
                <AssetList />
              </GridLayout.Column>
              <GridLayout.Column span={6}>
                <DepositModalContent />
              </GridLayout.Column>
            </GridLayout>
          ) : (
            <ConnectWalletPaper loading={loading}>
              {t('dashboard.notConnectedMessage')}
            </ConnectWalletPaper>
          )}
        </CoverLayout>
      </BoxLayout>
    </DepositContainer.Provider>
  )
}
export default DepositPage
