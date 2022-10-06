import React, { useState } from 'react'
import {
  Button,
  ColumnLayout,
  Menu,
  MenuItem,
  MenuItemTitle,
  Icon,
  Text,
  StackLayout,
  NetworkStatusIlustrator,
} from '@bloxifi/ui'
import { getNetworkName, sliceMiddleOfString } from '@bloxifi/core'
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
      chainId,
    },
  } = Web3Container.useContainer()

  const handleClose = () => {
    setCloseMenu(false)
  }

  const handleDisconnect = () => {
    setCloseMenu(false)
    disconnectWallet()
  }

  const getButtonContent = () => {
    if (!isMetamaskInstalled) {
      return t('walletConnection.installBrowserExtension', {
        walletName: 'Metamask',
      })
    }
    if (error && error.code === -32002) {
      return t('walletConnection.connecting')
    }
    return t('global.buttons.connectWallet')
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
                <ColumnLayout gap={0.5} align="space-between">
                  <Icon name="wallet" size={40} />
                  <StackLayout>
                    {sliceMiddleOfString(currentAccount, 4)}
                  </StackLayout>
                </ColumnLayout>
              </MenuItemTitle>

              <MenuItemTitle type="body 2">
                {t('header.network')}
                <ColumnLayout gap={0.5}>
                  <NetworkStatusIlustrator status="success" />
                  <Text type="body 3">{getNetworkName(chainId)}</Text>
                </ColumnLayout>
              </MenuItemTitle>

              <MenuItem
                appearance="text"
                variant="large"
                size="large"
                onClick={() => navigator.clipboard.writeText(currentAccount)}
              >
                {t('global.buttons.copyAddress')}
              </MenuItem>
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
        <Button
          appearance="primary-ghost"
          variant="medium"
          size="medium"
          disabled
          radius="rounded"
        >
          <ColumnLayout gap={0.5}>
            <Icon name="wallet" color="white" size={20} />
            <StackLayout>
              {t('walletConnection.wrongNetworkConnection', {
                networkName: 'Moonriver',
              })}
            </StackLayout>
          </ColumnLayout>
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
      disabled={!isMetamaskInstalled || (error && error.code === -32002)}
    >
      <ColumnLayout gap={0.5}>
        <Icon name="wallet" color="white" size={20} />
        <StackLayout>{getButtonContent()}</StackLayout>
      </ColumnLayout>
    </Button>
  )
}
