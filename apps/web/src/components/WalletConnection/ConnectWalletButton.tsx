import React from 'react'
import { Text } from '@bloxifi/ui'
import styled from 'styled-components'
import { getNetworkName } from '@bloxifi/core'

import { Web3Container } from '@/containers/Web3Container'

export const ConnectWalletButton = () => {
  const {
    connectWallet,
    disconnectWallet,
    state: {
      isConnected,
      currentAccount,
      error,
      isSupportedNetwork,
      chainId,
      isMetamaskInstalled,
    },
  } = Web3Container.useContainer()

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
        Connection failed!
      </Text>
    )
  }
  return isConnected ? (
    <div>
      <StyledText type="text xl" semiBold>
        Account:
      </StyledText>
      <StyledText
        type="text xl"
        color={isSupportedNetwork ? 'textGray' : 'red'}
      >{`${currentAccount.slice(0, 8)}...`}</StyledText>
      <StyledText type="text xl" semiBold>
        Network:
      </StyledText>
      <StyledText
        type="text xl"
        color={isSupportedNetwork ? 'textGray' : 'red'}
      >
        {getNetworkName(chainId)}
      </StyledText>
      <button onClick={disconnectWallet}> Disconnect</button>
    </div>
  ) : (
    <button onClick={connectWallet}>Connect wallet</button>
  )
}
const StyledText = styled(Text)`
  margin: 0 10px;
`
