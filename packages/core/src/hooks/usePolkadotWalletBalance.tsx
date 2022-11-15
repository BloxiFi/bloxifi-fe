import { ApiPromise, WsProvider } from '@polkadot/api'
import { useCallback, useEffect, useState } from 'react'

/**
 * Options that can be used to configure useWalletBalance() hook.
 */
export interface PolkadotWalletBalanceProps {
  /**
   * Supported networks
   */
  readonly network?: 'kusama' | 'karura'
  /**
   * User Polkadot wallet account
   */
  readonly currentAccount?: string
  /**
   * Token symbol
   */
  readonly currentSymbol?: 'KSM' | 'KAR' | 'MOVR' | 'AUSD'
}

/**
 * Return type of useWalletBalance hook
 */
export interface PolkadotWalletBalance {
  /**
   * Token Free Balance
   */
  tokenFreeBalance: string
  /**
   * Loading data state
   */
  isLoading: boolean
  /**
   * Error
   */
  error?: Error
}

const networks = {
  kusama: {
    provider: 'wss://kusama-rpc.polkadot.io',
    assets: [{ name: 'KSM', config: undefined }],
  },
  karura: {
    provider: 'wss://karura-rpc.dwellir.com',
    assets: [
      { name: 'KAR', config: undefined },
      { name: 'MOVR', config: { ForeignAsset: 3 } },
      { name: 'AUSD', config: { Token: 'AUSD' } },
    ],
  },
}

/**
 * Hook that returns Balance of xc Tokens from Polkadot/Kusama
 */
export const usePolkadotWalletBalance = ({
  network,
  currentAccount,
  currentSymbol,
}: PolkadotWalletBalanceProps = {}): PolkadotWalletBalance => {
  const [tokenFreeBalance, setTokenFreeBalance] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(undefined)

  const fetchBalances = useCallback(async () => {
    try {
      setIsLoading(true)

      // how to fetch specific asset on specific parachain (supported kusama and karura)
      const assetConfig =
        networks[network].assets.find(asset => asset.name === currentSymbol) ??
        undefined

      // initialized by Usage documentation in @polkadot/api/promise/Api.d.ts
      const provider = new WsProvider(networks[network]?.provider)
      const api = await new ApiPromise({ provider }).isReady

      if (assetConfig) {
        const codec = await api.query.system.account(
          currentAccount,
          assetConfig,
        )
        setTokenFreeBalance(codec['free'].toHuman()) // NOTE: in typescript there is no 'free' in Codec, we should be able just to use only `codec.toHuman()`
      } else {
        const codec = await api.query.system.account(currentAccount)
        setTokenFreeBalance(codec.data.free.toHuman())
      }
    } catch (error) {
      setError(error)
      throw new Error(error)
    } finally {
      setIsLoading(false)
    }
  }, [currentAccount, currentSymbol, network])

  useEffect(() => {
    void fetchBalances()
  }, [fetchBalances])

  return { isLoading, tokenFreeBalance, error }
}
