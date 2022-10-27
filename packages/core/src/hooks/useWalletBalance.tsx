import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config'
import { init, toDecimal, AssetBalanceInfo } from '@moonbeam-network/xcm-sdk'
import { useCallback, useEffect, useState } from 'react'

import {
  ChainIdsNumber,
  getNetworkByChain,
  networkConfig,
  NetworkConfigType,
  SupportedNetwork,
} from '../utilities'

/**
 * Options that can be used to configure useWalletBalance() hook.
 */
export interface Props {
  /**
   * User wallet account
   */
  readonly currentAccount?: string
  /**
   * Connected network ID
   */
  readonly currentChainId?: SupportedNetwork['prefix'] | ChainIdsNumber
}

/**
 * Return type of useWalletBalance hook
 */
export interface TokenBalanceData {
  /**
   * Token Symbol
   */
  tokenSymbol: string
  /**
   * Token Balance
   */
  tokenBalance: number
  /**
   * Token Origin Network
   */
  tokenOrigin: string
  /**
   * Token Origin Symbol
   */
  tokenOriginSymbol: string
}

function mapBalances<Asset extends AssetSymbol>(
  balances: AssetBalanceInfo<Asset>[],
): TokenBalanceData[] {
  return balances.map(({ asset, balance, origin }) => ({
    tokenSymbol: balance.symbol,
    tokenBalance: toDecimal(balance.balance, balance.decimals),
    tokenOrigin: origin.name,
    tokenOriginSymbol: asset.originSymbol,
  }))
}

interface UseWalletBallanceState {
  /**
   * Whether the hook is fetching data.
   */
  isLoading: boolean
  /**
   * Balance of xc Tokens
   */
  balances: TokenBalanceData[]
}

/**
 * Hook that returns Balance of xc Tokens
 */
export const useWalletBalance = ({
  currentAccount,
  currentChainId,
}: Props = {}): UseWalletBallanceState => {
  const xcmSdk = init()
  const [balances, setBalances] = useState<TokenBalanceData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBalances = useCallback(
    async (
      network:
        | SupportedNetwork['network']
        | NetworkConfigType[keyof NetworkConfigType]['name'],
    ) => {
      try {
        setIsLoading(true)

        await xcmSdk[network.toLowerCase()].subscribeToAssetsBalanceInfo(
          currentAccount,
          (balances: AssetBalanceInfo<AssetSymbol, ChainKey>[]) => {
            setBalances(mapBalances(balances))
          },
        )
      } catch (error) {
        throw new Error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [currentAccount, xcmSdk],
  )

  useEffect(() => {
    const network =
      getNetworkByChain(currentChainId as SupportedNetwork['prefix'])
        ?.network || networkConfig[currentChainId]?.name

    if (network) {
      void fetchBalances(network)
    }
  }, [currentChainId, fetchBalances])

  return { balances, isLoading }
}
