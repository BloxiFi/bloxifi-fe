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
      <Text type="body 1" color="red" semiBold align="center">
        Please install Metamask
      </Text>
    )
  }

  if (error) {
    return (
      <Text type="body 1" color="red" semiBold align="center">
        Connection failed!
      </Text>
    )
  }
  return isConnected ? (
    <div>
      <StyledText type="body 3" as="span" semiBold>
        Account:
      </StyledText>
      <StyledText
        as="span"
        type="body 3"
        color={isSupportedNetwork ? 'textColorLight' : 'red'}
      >{`${currentAccount.slice(0, 8)}...`}</StyledText>
      <StyledText as="span" type="body 3" semiBold>
        Network:
      </StyledText>
      <StyledText
        as="span"
        type="body 3"
        color={isSupportedNetwork ? 'textColorLight' : 'red'}
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
