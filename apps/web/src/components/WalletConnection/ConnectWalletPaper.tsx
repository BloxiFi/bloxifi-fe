import { BoxLayout, StackLayout, Text } from '@bloxifi/ui'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ConnectWalletButton } from './ConnectWalletButton'

type ConnectWalletPaperProps = {
  loading?: boolean
  children?: ReactNode
}

export const ConnectWalletPaper = ({
  loading,
  children,
}: ConnectWalletPaperProps) => {
  const { t } = useTranslation()

  return (
    <BoxLayout>
      {loading ? (
        'loading...'
      ) : (
        <StackLayout>
          <Text type="heading 3" semiBold align="center">
            {t('walletConnection.notConnectedTitle')}
          </Text>
          <Text type="body 1" color="textColorLight" align="center">
            {children || t('dashboard.notConnectedMessage')}
          </Text>
          <ConnectWalletButton />
        </StackLayout>
      )}
    </BoxLayout>
  )
}
