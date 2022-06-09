import React from 'react'
import { Text } from '@bloxifi/ui'
import styled from 'styled-components'
import { useContainer } from 'unstated-next'

import { UserContainer } from '@/containers/UserContainer'
import { Web3Container } from '@/containers/Web3Container'
import { getNetworkName } from '@bloxifi/core'

export const ConnectWalletButton = () => {
  const {
    state: { isMetamaskInstalled },
  } = UserContainer.useContainer()
  const {
    connectWallet,
    disconnectWallet,
    state: { connected, currentAccount, error, isSupportedNetwork, chainId },
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
        Connection failed!
      </Text>
    )
  }
  return connected ? (
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
