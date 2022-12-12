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
  BoxLayout,
} from '@bloxifi/ui'
import { getNetworkName, sliceMiddleOfString } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'

import { CopyAddressModal } from '../header/CopyAddressModal'

import { Web3Container } from '@/containers/Web3Container'

export const ConnectWalletButton = () => {
  const { t } = useTranslation()
  const MOONBASE_EXPLORER = process.env.MOONBASE_EXPLORER
  const [closeMenu, setCloseMenu] = useState(false)
  const [copyAddressModal, setCopyAddressModal] = useState<boolean>(false)

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

  const isConnectionInterupted = error && error.code === -32002

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
    if (isConnectionInterupted) {
      return t('walletConnection.connecting')
    }
    return t('global.buttons.connectWallet')
  }

  const closeModal = () => {
    setCopyAddressModal(false)
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(currentAccount)
    setCopyAddressModal(true)
  }

  return isConnected ? (
    <ColumnLayout>
      {/**TODO handle BLOX balance button click when we get BLOX token on Moonbeam, wait for BE to generate it 
      <Button
        className="u-fit-content-width"
        appearance="primary-ghost"
        variant="medium"
        size="medium"
      >
        <BoxLayout gap={0.2}>
          <ColumnLayout gap={0.5}>
            <Icon name="blox-logo" size={20} />
            <StackLayout>{t('global.buttons.bloxBalance')}</StackLayout>
          </ColumnLayout>
        </BoxLayout>
      </Button>
      */}
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
              <BoxLayout gap={0.2}>
                <ColumnLayout gap={0.5}>
                  <Icon name="wallet" color="white" size={20} />
                  <StackLayout>
                    {sliceMiddleOfString(currentAccount, 4)}
                  </StackLayout>
                </ColumnLayout>
              </BoxLayout>
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
                onClick={copyAddress}
              >
                {t('global.buttons.copyAddress')}
              </MenuItem>
              <CopyAddressModal
                isOpen={copyAddressModal}
                onClose={closeModal}
              />
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
        <BoxLayout gap={0.2}>
          <Button
            className="u-fit-content-width"
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
        </BoxLayout>
      )}
    </ColumnLayout>
  ) : (
    <Button
      className="u-fit-content-width"
      radius="rounded"
      appearance="primary-ghost"
      variant="medium"
      size="medium"
      onClick={connectWallet}
      disabled={!isMetamaskInstalled || isConnectionInterupted}
    >
      <BoxLayout gap={0.2}>
        <ColumnLayout gap={0.5}>
          <Icon name="wallet" color="white" size={20} />
          <StackLayout>{getButtonContent()}</StackLayout>
        </ColumnLayout>
      </BoxLayout>
    </Button>
  )
}
