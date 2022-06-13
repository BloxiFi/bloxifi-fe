import React from 'react'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'

import { DepositContainer } from '@/containers/DepositContainer'

export const DepositModalContent = () => {
  const { t } = useTranslation()
  const {
    state: { selectedAsset },
  } = DepositContainer.useContainer()

  return (
    <BoxLayout>
      <StackLayout
        gap={0.5}
        style={{ border: '1px solid', padding: 20, margin: 20, width: 300 }}
      >
        <h3>{t('deposit.depositAsset')}</h3>
        <h3> {selectedAsset}</h3>
      </StackLayout>
    </BoxLayout>
  )
}
