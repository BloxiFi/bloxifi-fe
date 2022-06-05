import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { BoxLayout, Text, StackLayout } from '@bloxifi/ui'

import { UserContainer } from '@/containers/UserContainer'

const supportedChains = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  1284: 'moonbeam',
}

export const supportedChainIds = Object.keys(supportedChains).map(key =>
  Number(key),
)

export const ConnectWalletButton = () => {
  const {
    state: { isMetamaskInstalled },
  } = UserContainer.useContainer()
  const web3Context = useWeb3React()

  async function connect() {
    try {
      await web3Context.activate(
        new InjectedConnector({ supportedChainIds }),
        undefined,
        true,
      )
    } catch (error) {
      web3Context.setError(error)
    }
  }

  function disconnect() {
    try {
      web3Context.deactivate()
    } catch (error) {
      web3Context.setError(error)
    }
  }

  if (!isMetamaskInstalled) {
    return (
      <Text type="text xl" color="red" semiBold align="center">
        Please install Metamask
      </Text>
    )
  }

  if (web3Context.error) {
    return (
      <Text type="text xl" color="red" semiBold align="center">
        {web3Context.error.name === 'UnsupportedChainIdError'
          ? ' Wrong network connection!'
          : 'Connection failed!'}
      </Text>
    )
  }

  return (
    <BoxLayout>
      <StackLayout>
        {web3Context.active ? (
          <>
            <Text type="text xl" color="green" semiBold align="center">
              {`Connected to ${supportedChains[web3Context.chainId]} !`}
            </Text>
            <Text type="text xl" color="textGray" semiBold align="center">
              {web3Context.account}
            </Text>
            <button onClick={disconnect}>Disconnect</button>
          </>
        ) : (
          <Text type="text xl" color="textGray" semiBold align="center">
            <button onClick={connect}>Connect wallet</button>
          </Text>
        )}
      </StackLayout>
    </BoxLayout>
  )
}
