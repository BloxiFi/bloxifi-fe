import React from 'react'
import { Text } from '@bloxifi/ui'
import styled from 'styled-components'
import { useContainer } from 'unstated-next'

import { UserContainer } from '@/containers/UserContainer'
import { Web3Container } from '@/containers/Web3Container'

const supportedChains = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  1284: 'moonbeam',
  1287: 'moonbase alpha',
}

export const supportedChainIds = Object.keys(supportedChains).map(key =>
  Number(key),
)

export const ConnectWalletButton = () => {
  const {
    state: { isMetamaskInstalled },
  } = UserContainer.useContainer()
  const {
    connectWallet,
    disconnectWallet,
    state: { connected, currentAccount, error },
  } = useContainer(Web3Container)

  if (!isMetamaskInstalled) {
    return (
      <Text type="text xl" color="red" semiBold align="center">
        Please install Metamask
      </Text>
    )
  }

  if (error) {
    return (
      <Text type="text xl" color="red" semiBold align="center">
        {error.name === 'UnsupportedChainIdError'
          ? ' Wrong network connection!'
          : 'Connection failed!'}
      </Text>
    )
  }
  return connected ? (
    <div>
      <Address>{`${currentAccount.slice(0, 8)}...`}</Address>
      <button onClick={disconnectWallet}> Disconnect</button>
    </div>
  ) : (
    <button onClick={connectWallet}>Connect wallet</button>
  )
}
const Address = styled.span`
  margin: 0 20px;
`
