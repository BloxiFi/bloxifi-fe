import React, { useState } from 'react'
import {
  Button,
  ColumnLayout,
  Menu,
  MenuItemTitle,
  Icon,
  StackLayout,
  BoxLayout,
  MenuItem,
  Text,
} from '@bloxifi/ui'
import { sliceMiddleOfString } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { PolkadotAccount } from '@bloxifi/types'

import { Web3PolkadotContainer } from '@/containers/Web3PolkadotContainer'

export const ConnectPolkadotButton = () => {
  const { t } = useTranslation()
  const [closeMenu, setCloseMenu] = useState(false)

  const {
    connectWallet,
    dispatch,
    state: {
      currentAccountPolkadot,
      isSupportedNetworkPolkadot,
      isPolkadotEnabled,
      errorPolkadot,
      accounts,
    },
  } = Web3PolkadotContainer.useContainer()

  const isConnectionInterupted = errorPolkadot && errorPolkadot.code === -32002

  const handleClose = () => {
    setCloseMenu(false)
  }

  const getButtonContent = () => {
    if (isConnectionInterupted) {
      return t('walletConnection.connecting')
    }
    return t('global.buttons.connectWallet')
  }

  return isPolkadotEnabled ? (
    <ColumnLayout>
      {isSupportedNetworkPolkadot ? (
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
                  <Icon name="polkadot" size={20} />
                  <StackLayout>
                    {sliceMiddleOfString(currentAccountPolkadot, 4)}
                  </StackLayout>
                </ColumnLayout>
              </BoxLayout>
            </Button>
          }
          field={
            <StackLayout>
              <MenuItemTitle type="heading 3">
                <ColumnLayout gap={0.5} align="space-between">
                  <Icon name="polkadot" size={40} />
                  <StackLayout>
                    {sliceMiddleOfString(currentAccountPolkadot, 4)}
                  </StackLayout>
                </ColumnLayout>
              </MenuItemTitle>
              {accounts.map((account: PolkadotAccount) => (
                <MenuItem
                  key={account.name}
                  className="u-full-width"
                  appearance="text"
                  variant="large"
                  size="large"
                  disabled={account.address === currentAccountPolkadot}
                  onClick={() =>
                    dispatch({
                      type: 'setCurrentAccount',
                      value: account.address,
                    })
                  }
                >
                  <StackLayout gap={0.2}>
                    <Text align="left" type="body 2">
                      {account.name}
                    </Text>
                    <Text align="left" type="body 3">
                      {sliceMiddleOfString(account.address, 7)}
                    </Text>
                  </StackLayout>
                </MenuItem>
              ))}
            </StackLayout>
          }
        />
      ) : (
        <Button
          className="u-fit-content-width"
          appearance="primary-ghost"
          variant="medium"
          size="medium"
          disabled
          radius="rounded"
        >
          <BoxLayout gap={0.2}>
            <ColumnLayout gap={0.5}>
              <Icon name="polkadot" color="white" size={20} />
              <StackLayout>
                {t('walletConnection.wrongNetworkConnection', {
                  networkName: 'Moonriver',
                })}
              </StackLayout>
            </ColumnLayout>
          </BoxLayout>
        </Button>
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
      disabled={!isPolkadotEnabled || isConnectionInterupted}
    >
      <BoxLayout gap={0.2}>
        <ColumnLayout gap={0.5}>
          <Icon name="polkadot" size={20} />
          <StackLayout>{getButtonContent()}</StackLayout>
        </ColumnLayout>
      </BoxLayout>
    </Button>
  )
}
