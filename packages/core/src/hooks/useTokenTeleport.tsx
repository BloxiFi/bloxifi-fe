import { useCallback, useEffect, useState } from 'react'
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config'
import { init } from '@moonbeam-network/xcm-sdk'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { JsonRpcSigner } from '@ethersproject/providers'

/**
 * Options that can be used to configure useTokenTeleport() hook.
 */
export interface Props {
  /**
   * Origin chain
   */
  readonly originChain?: string
  /**
   * Destination chain
   */
  readonly destinationChain?: string
  /**
   * Token symbol
   */
  readonly tokenSymbol?: string
  /**
   * Token amount
   */
  readonly tokenAmount?: number
  /**
   * Polkadot account/signer
   */
  readonly polkaAccount?: InjectedAccountWithMeta
  /**
   * Metamask account
   */
  readonly metamaskAccount?: string
  /**
   * Metamask signer
   */
  readonly metamaskSigner?: JsonRpcSigner
}

//deposit -> from Polka to Moonriver
//withdraw -> from Moonriver to Polkadot

/* const providerRPC = {
  moonriver: {
    name: 'moonriver',
    rpc: 'https://rpc.api.moonriver.moonbeam.network',
    chainId: 1285,
  },
} */
const withdrawToken = async (
  _amount: bigint,
  _polkaAcc: string,
  _metamaskSigner: JsonRpcSigner,
  _tokenSymbol: string,
  _chain: string,
) => {
  const polkaInjector = await web3FromAddress(_polkaAcc)
  const polkaSigner = polkaInjector.signer
  const { moonriver } = init({
    ethersSigner: _metamaskSigner,
    polkadotSigner: polkaSigner,
  })

  const token = AssetSymbol[_tokenSymbol]
  const chain = ChainKey[_chain]
  const { to } = moonriver.withdraw(token)
  const { send } = await to(chain).get(_polkaAcc)

  return await send(_amount, event => {
    return event
  })
}

const depositToken = async (
  _amount: bigint,
  _polkaAcc: string,
  _metamaskSigner: JsonRpcSigner,
  _metamaskAcc: string,
  _tokenSymbol: string,
  _chain: string,
) => {
  const polkaInjector = await web3FromAddress(_polkaAcc)
  const polkaSigner = polkaInjector.signer
  const { moonriver } = init({
    ethersSigner: _metamaskSigner,
    polkadotSigner: polkaSigner,
  })

  const token = AssetSymbol[_tokenSymbol]
  const chain = ChainKey[_chain]

  const { from } = moonriver.deposit(token)
  const { send } = await from(chain).get(_metamaskAcc, _polkaAcc)
  return await send(_amount, event => {
    return event
  })
}

/**
 * Hook that execute Token Teleport
 */
export const useTokenTeleport = ({
  originChain,
  destinationChain,
  tokenAmount,
  polkaAccount,
  metamaskSigner,
  metamaskAccount,
  tokenSymbol,
}: Props = {}) => {
  //const [retLog, setRetLog] = useState<ExtrinsicEvent['txHash']>()
  const [isLoading, setIsLoading] = useState(false)
  const [transaction, setTransaction] = useState('')

  const handleTransfer = useCallback(async () => {
    try {
      setIsLoading(true)

      if (originChain === 'Moonriver') {
        const transaction = await withdrawToken(
          BigInt(tokenAmount),
          polkaAccount.address,
          metamaskSigner,
          tokenSymbol,
          destinationChain,
        )

        setTransaction(transaction.toString())
      } else if (destinationChain === 'Moonriver') {
        const transaction = await depositToken(
          BigInt(tokenAmount),
          polkaAccount.address,
          metamaskSigner,
          metamaskAccount,
          tokenSymbol,
          originChain,
        )

        setTransaction(transaction.toString())
      }
    } catch (e) {
      throw new Error(e)
    } finally {
      setIsLoading(false)
    }
  }, [
    destinationChain,
    metamaskAccount,
    metamaskSigner,
    originChain,
    polkaAccount.address,
    tokenAmount,
    tokenSymbol,
  ])

  useEffect(() => {
    void handleTransfer()
  }, [handleTransfer])

  return { isLoading, transaction }
}
