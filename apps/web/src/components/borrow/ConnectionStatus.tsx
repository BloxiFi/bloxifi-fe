import React, { FunctionComponent, useState, useEffect } from 'react'
import { BoxLayout, Button, CardLayout, CenterLayout, Text } from '@bloxifi/ui'
import { GridLayout } from '@bloxifi/ui/src/Layouts/GridLayout'
import { useTranslation } from 'react-i18next'

import { Web3Container } from '@/containers/Web3Container'

export const ConnectionStatus: FunctionComponent = () => {
  const {
    connectWallet,
    state: {
      isConnected,
      isSupportedNetwork,
      loading: connectionLoading,
      isMetamaskInstalled,
      error,
    },
  } = Web3Container.useContainer()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showConnectButton, setShowConnectButton] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isMetamaskInstalled) {
      setTitle(t('global.notifications.installMetamaskTitle'))
      setDescription(t('global.notifications.installMetamaskDescription'))
    } else if (error) {
      if (error.code === -32002) {
        setTitle(t('global.notifications.processingTheConnectionTitle'))
        setDescription(
          t('global.notifications.processingTheConnectionDescription', {
            walletName: 'Metamask',
          }),
        )
        setShowConnectButton(false)
      }
    } else if (!isConnected) {
      setTitle(t('global.notifications.connectTheWalletTitle'))
      setDescription(t('global.notifications.connectTheWalletDescription'))
      setShowConnectButton(true)
    } else if (isConnected && !isSupportedNetwork) {
      setTitle(t('global.notifications.notSupportedNetworkTitle'))
      setDescription(t('global.notifications.notSupportedNetworkDescription'))
      setShowConnectButton(false)
    }
  }, [
    isSupportedNetwork,
    isConnected,
    isMetamaskInstalled,
    error,
    connectionLoading,
    t,
  ])

  return (
    <GridLayout.Column span={12}>
      <CardLayout>
        <BoxLayout gap={8}>
          <GridLayout>
            <GridLayout.Column span={1} />
            <GridLayout.Column span={10}>
              <CenterLayout>
                <Text
                  align="center"
                  as="span"
                  color="oxfordBlue"
                  type="heading 2"
                >
                  {title}
                </Text>
                <Text align="center" color="oxfordBlue" type="body 5">
                  {description}
                </Text>
                {showConnectButton && (
                  <Button
                    appearance="primary"
                    size="medium"
                    variant="medium"
                    onClick={connectWallet}
                  >
                    {t('global.buttons.connectWallet')}
                  </Button>
                )}
              </CenterLayout>
            </GridLayout.Column>
            <GridLayout.Column span={1} />
          </GridLayout>
        </BoxLayout>
      </CardLayout>
    </GridLayout.Column>
  )
}
