import React, { useState } from 'react'
import {
  BoxLayout,
  Button,
  ColumnLayout,
  Menu,
  MenuItem,
  MenuItemTitle,
  Icon,
  Text,
  StackLayout,
} from '@bloxifi/ui'
import { sliceMiddleOfString } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'

import { Web3Container } from '@/containers/Web3Container'

export const ConnectWalletButton = () => {
  const { t } = useTranslation()
  const MOONBASE_EXPLORER = process.env.MOONBASE_EXPLORER
  const [closeMenu, setCloseMenu] = useState(false)

  const {
    connectWallet,
    disconnectWallet,
    state: {
      isConnected,
      currentAccount,
      isSupportedNetwork,
      isMetamaskInstalled,
      error,
    },
  } = Web3Container.useContainer()

  const handleClose = () => {
    setCloseMenu(false)
  }

  const handleDisconnect = () => {
    setCloseMenu(false)
    disconnectWallet()
  }

  if (!isMetamaskInstalled) {
    return (
      <Text type="body 1" color="red" semiBold align="center">
        {t('walletConnection.installBrowserExtension', {
          walletName: 'Metamask',
        })}
      </Text>
    )
  }

  if (error && error.code === -32002) {
    return (
      <Text type="body 1" color="red" semiBold align="center">
        {t('walletConnection.connecting')}
      </Text>
    )
  }

  return isConnected ? (
    <ColumnLayout>
      {/**TODO handle BLOX balance button click when we get BLOX token on Moonbeam, wait for BE to generate it */}
      <Button variant="medium" appearance="primary-ghost" size="medium">
        {t('global.buttons.bloxBalance')}
      </Button>
      {isSupportedNetwork ? (
        <Menu
          right
          bottom
          positionOffset={{ top: 5, left: 0 }}
          forceClose={closeMenu}
          onClose={handleClose}
          toggler={
            <Button
              className="u-fit-content-width"
              appearance="primary-ghost"
              variant="medium"
              size="medium"
              radius="rounded"
            >
              <ColumnLayout gap={0.5}>
                <Icon name="wallet" color="white" size={20} />
                <StackLayout>
                  {sliceMiddleOfString(currentAccount, 4)}
                </StackLayout>
              </ColumnLayout>
            </Button>
          }
          field={
            <StackLayout>
              <MenuItemTitle type="heading 3">
                {sliceMiddleOfString(currentAccount, 4)}
              </MenuItemTitle>

              <MenuItem
                appearance="text"
                variant="large"
                size="large"
                onClick={() =>
                  window.open(`${MOONBASE_EXPLORER}${currentAccount}`, '_blank')
                }
              >
                {t('global.buttons.viewOnExplorer')}
              </MenuItem>
              <MenuItem
                appearance="text"
                variant="large"
                size="large"
                onClick={handleDisconnect}
                isLastItem
              >
                {t('global.buttons.disconnectWallet')}
              </MenuItem>
            </StackLayout>
          }
        />
      ) : (
        <Button appearance="text" variant="medium" size="medium" color="red">
          {t('walletConnection.wrongNetworkConnection')}
        </Button>
      )}
    </ColumnLayout>
  ) : (
    <Button
      radius="rounded"
      appearance="primary-ghost"
      variant="medium"
      size="medium"
      onClick={connectWallet}
    >
      <ColumnLayout gap={0.5}>
        <Icon name="wallet" color="white" size={20} />
        <StackLayout>{t('global.buttons.connectWallet')}</StackLayout>
      </ColumnLayout>
    </Button>
  )
}
