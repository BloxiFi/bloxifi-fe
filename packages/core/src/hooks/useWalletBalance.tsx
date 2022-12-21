import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config'
import { AssetBalanceInfo, init, toDecimal } from '@moonbeam-network/xcm-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { SupportedNetwork } from '../utilities'

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
  readonly currentChainId?: number
  /**
   * Current network config data
   */
  readonly currentNetwork?: SupportedNetwork
}

/**
 * Return type of useWalletBalance hook
 */
export type TokenBalanceData = {
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
  /**
   * Function for refetch balances
   */
  fetchBalances: () => void
}

/**
 * Hook that returns Balance of xc Tokens
 */
export const useWalletBalance = ({
  currentAccount,
  currentChainId,
  currentNetwork,
}: Props = {}): UseWalletBallanceState => {
  const xcmSdk = useMemo(() => init(), [])
  const [balances, setBalances] = useState<TokenBalanceData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchBalances = useCallback(async () =>
    //network: SupportedNetwork['network'],
    //supportedSymbols: any, //TODO Remove any type
    {
      const network = currentNetwork.network
      const supportedSymbols: any = currentNetwork.supportedSymbols
      try {
        setIsLoading(true)

        await xcmSdk[network.toLowerCase()].subscribeToAssetsBalanceInfo(
          currentAccount,
          (balances: AssetBalanceInfo<AssetSymbol, ChainKey>[]) => {
            setBalances(
              mapBalances(balances).filter(({ tokenSymbol }) =>
                supportedSymbols.includes(tokenSymbol),
              ),
            )
          },
        )
      } catch (error) {
        throw new Error(error)
      } finally {
        setIsLoading(false)
      }
    }, [
    currentAccount,
    currentNetwork?.network,
    currentNetwork?.supportedSymbols,
    xcmSdk,
  ])

  useEffect(() => {
    if (currentNetwork && balances.length === 0) {
      void fetchBalances()
      //currentNetwork.network,
      //currentNetwork?.supportedSymbols,
    }
  }, [currentChainId, fetchBalances, currentNetwork, balances.length])

  return { balances, isLoading, fetchBalances }
}
