import { ApiPromise, WsProvider } from '@polkadot/api'
import '@polkadot/api-augment'
import { useCallback, useEffect, useState } from 'react'

/**
 * Options that can be used to configure useWalletBalance() hook.
 */
export interface PolkadotWalletBalanceProps {
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

const tokenConfig = {
  KSM: {
    getPolkadotBalance: async (acc: string) => {
      const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io')
      const api = await ApiPromise.create({ provider: wsProvider })
      const { data: balance } = await api.query.system.account(acc)
      return balance.free.toHuman()
    },
  },
  KAR: {
    getPolkadotBalance: async (acc: string) => {
      const wsProvider = new WsProvider('wss://karura-rpc.dwellir.com')
      const api = await ApiPromise.create({ provider: wsProvider })
      const { data: balance } = await api.query.system.account(acc)
      return balance.free.toHuman()
    },
  },

  MOVR: {
    getPolkadotBalance: async (acc: string) => {
      const wsProvider = new WsProvider('wss://karura-rpc.dwellir.com')
      const api = await ApiPromise.create({ provider: wsProvider })
      const MOVR = await api.query.tokens.accounts(acc, { ForeignAsset: 3 })
      return MOVR['free'].toHuman()
    },
  },
  AUSD: {
    getPolkadotBalance: async (acc: string) => {
      const wsProvider = new WsProvider('wss://karura-rpc.dwellir.com')
      const api = await ApiPromise.create({ provider: wsProvider })
      const AUSD = await api.query.tokens.accounts(acc, { Token: 'AUSD' })
      return AUSD['free'].toHuman()
    },
  },
}

/**
 * Hook that returns Balance of xc Tokens from Polkadot/Kusama
 */
export const usePolkadotWalletBalance = ({
  currentAccount,
  currentSymbol,
}: PolkadotWalletBalanceProps = {}): PolkadotWalletBalance => {
  const [tokenFreeBalance, setTokenFreeBalance] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(undefined)

  const fetchBalances = useCallback(async (currentAccount, currentSymbol) => {
    try {
      setIsLoading(true)
      setTokenFreeBalance(
        await tokenConfig[currentSymbol].getPolkadotBalance(currentAccount),
      )
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchBalances(currentAccount, currentSymbol)
  }, [currentAccount, currentSymbol, fetchBalances])

  return { isLoading, tokenFreeBalance, error }
}
