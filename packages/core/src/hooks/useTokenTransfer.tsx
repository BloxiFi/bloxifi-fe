import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config'
import {
  init,
  DepositTransferData,
  ExtrinsicEvent,
  WithdrawTransferData,
  XcmSdkByChain,
} from '@moonbeam-network/xcm-sdk'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { JsonRpcSigner } from '@ethersproject/providers'
import { parseUnits } from 'ethers/lib/utils'
import { useCallback, useState } from 'react'

import { SupportedNetwork, toCapitalize } from '../utilities'

export type SupportedTransferChains = Extract<
  SupportedNetwork['network'],
  keyof XcmSdkByChain | 'karura' | 'kusama'
>

interface UseTokenTransferProps {
  /**
   * Metamask signer (`ethersSigner`)
   */
  metamaskSigner: JsonRpcSigner
  /**
   * Current account in metamask
   */
  metamaskAccount: string
  /**
   * Polkadot address.
   */
  polkadotAccount: InjectedAccountWithMeta['address']
  /**
   * Possible values are all moonbeam-networks
   */
  transferOrigin: SupportedNetwork['network']
  /**
   * Possible values are all moonbeam-networks
   */
  transferDestination: SupportedNetwork['network']
}

interface TokenTransferFunctionProps {
  /**
   * Token amount to be transferred in string
   */
  tokenAmount: string
  /**
   * Token symbol
   */
  tokenSymbol: SuportedTransferTokens
}

interface UseTokenTranferState {
  /**
   * Wheter we are transfering the data
   */
  isLoading: boolean
  /**
   * If some error occurs while transfering the data
   */
  hasError: boolean
  /**
   * Returns event for TransferData
   */
  event: ExtrinsicEvent
  /**
   * Function that will trigger data trusnfer depending on the destination and origin chain
   */
  transferToken: (props: TokenTransferFunctionProps) => Promise<void>
}

export type SuportedTransferTokens = 'MOVR' | 'KAR' | 'aUSD' | 'KSM'

export const DEFAULT_ORIGIN_CHAIN = 'moonriver'

const moonBeamNetworks: Array<keyof XcmSdkByChain> = [
  'moonriver',
  'moonbase',
  'moonbeam',
]

/**
 * Function that execute Token Transfer logic
 */
export const useTokenTransfer = ({
  metamaskAccount,
  metamaskSigner,
  polkadotAccount,
  transferDestination,
  transferOrigin,
}: UseTokenTransferProps): UseTokenTranferState => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [event, setEvent] = useState<ExtrinsicEvent>()

  const transferToken = useCallback(
    async ({ tokenAmount, tokenSymbol }: TokenTransferFunctionProps) => {
      try {
        setHasError(false)
        setIsLoading(true)
        const polkaInjector = await web3FromAddress(polkadotAccount)
        const polkaSigner = polkaInjector.signer

        // is Withdrawl if transferOrigin is one of moonBeamNetworks
        const isWithdrawl = moonBeamNetworks.includes(
          transferOrigin as keyof XcmSdkByChain,
        )

        // is isDeposit if transferDestination is one of moonBeamNetworks
        const isDeposit = moonBeamNetworks.includes(
          transferDestination as keyof XcmSdkByChain,
        )

        // should return the chain where to do the transfer, used only to confirm if the destination chain is supoorted via `ChainKey`
        const transferChain = isWithdrawl
          ? transferDestination
          : isDeposit
          ? transferOrigin
          : undefined

        const xcmSdkByChain = init({
          ethersSigner: metamaskSigner,
          polkadotSigner: polkaSigner,
        })

        // pick the sdkChain we want to use (should be one of the three moonbaseNetworks). Defaults to moonriver
        const sdkChain = isWithdrawl
          ? transferOrigin
          : isDeposit
          ? transferDestination
          : DEFAULT_ORIGIN_CHAIN

        // for dynamic purpose, we should just pass, and extract from `init` function what sdk we want. Defaults to 'moonriver'
        const currentSDK = xcmSdkByChain[sdkChain]

        const token = AssetSymbol[tokenSymbol.toUpperCase()]
        const chain = ChainKey[toCapitalize(transferChain)]

        // return error if tokenSymbol is not one of the supported ones in `AssetSymbol`
        if (!token) {
          throw new Error('Token is not supported')
        }

        // return error if transferChain is not one of the supported ones in `ChainKey`
        if (!chain) {
          throw new Error('Destination Chain not supported')
        }

        if (isWithdrawl) {
          //returns the sdkWithdrawTo (synchronous action)
          const withdrawlTo = currentSDK.withdraw(token).to(chain)

          // prepare the withrdawTransferData (async function)
          const withdrawTransferData: WithdrawTransferData =
            await withdrawlTo.get(polkadotAccount)

          const amount = parseUnits(
            tokenAmount,
            withdrawTransferData.asset.decimals,
          )

          //execute the transfer and report via `setEvent`
          await withdrawTransferData.send(amount.toBigInt(), event => {
            setEvent(event)
          })
        } else if (isDeposit) {
          //returns the sdkDepositFrom (synchronous action)
          const depositFrom = currentSDK.deposit(token).from(chain)

          // prepare the depositTransferData (async function)
          const depositTransferData: DepositTransferData =
            await depositFrom.get(metamaskAccount, polkadotAccount)

          const amount = parseUnits(
            tokenAmount,
            depositTransferData.asset.decimals,
          )
          //execute the transfer and report via `setEvent`

          await depositTransferData.send(amount.toBigInt(), event => {
            setEvent(event)
          })
        }
      } catch (error) {
        setHasError(true)
        throw new Error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      metamaskAccount,
      metamaskSigner,
      polkadotAccount,
      transferDestination,
      transferOrigin,
    ],
  )

  return { isLoading, hasError, event, transferToken }
}
