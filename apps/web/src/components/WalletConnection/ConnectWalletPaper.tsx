import { BoxLayout, StackLayout, Text } from '@bloxifi/ui'
import React, { ReactNode } from 'react'

import { ConnectWalletButton } from './ConnectWalletButton'

type ConnectWalletPaperProps = {
  loading?: boolean
  description?: ReactNode
}

export const ConnectWalletPaper = ({
  loading,
  description,
}: ConnectWalletPaperProps) => {
  return (
    <BoxLayout>
      {loading ? (
        'loading...'
      ) : (
        <StackLayout>
          <Text type="heading 4" semiBold align="center">
            Please, connect your wallet
          </Text>
          <Text type="text m" color="textGray" align="center">
            {description ||
              ' Please connect your wallet to see your supplies, borrowings, and open positions.'}
          </Text>
          <ConnectWalletButton />
        </StackLayout>
      )}
    </BoxLayout>
  )
}
