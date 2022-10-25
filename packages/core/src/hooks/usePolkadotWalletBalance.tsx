import { ApiPromise, WsProvider } from '@polkadot/api'
import '@polkadot/api-augment'

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
  readonly currentSymbol?: string
}

/**
 * Return type of useWalletBalance hook
 */
export interface TokenBalanceData {
  /**
   * Token Free Balance
   */
  tokenFreeBalance: number
}

const getKusamaBalance = async (acc: string) => {
  const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io')
  const api = await ApiPromise.create({ provider: wsProvider })
  const { data: balance } = await api.query.system.account(acc)
  return balance.free.toHuman()
}

const getKaruraBalance = async (acc: string) => {
  const wsProvider = new WsProvider('wss://karura-rpc.dwellir.com')
  const api = await ApiPromise.create({ provider: wsProvider })
  const { data: balance } = await api.query.system.account(acc)
  return balance.free.toHuman()
}

const getMovrBalance = async (acc: string) => {
  const wsProvider = new WsProvider('wss://karura-rpc.dwellir.com')
  const api = await ApiPromise.create({ provider: wsProvider })
  const MOVR = await api.query.tokens.accounts(acc, { ForeignAsset: 3 })
  return MOVR['free'].toHuman()
}

const getAUSDBalance = async (acc: string) => {
  const wsProvider = new WsProvider('wss://karura-rpc.dwellir.com')
  const api = await ApiPromise.create({ provider: wsProvider })
  const AUSD = await api.query.tokens.accounts(acc, { Token: 'AUSD' })
  return AUSD['free'].toHuman()
}

/**
 * Hook that returns Balance of xc Tokens from Polkadot/Kusama
 */
export const usePolkadotWalletBalance = ({
  currentAccount,
  currentSymbol,
}: Props = {}): TokenBalanceData[] => {
  const balanceReturned: TokenBalanceData[] = []

  if (currentSymbol == 'KSM') {
    const tb = async () => await getKusamaBalance(currentAccount)
    const balanceReturned = tb()
  } else if (currentSymbol == 'KAR') {
    const tb = async () => await getKaruraBalance(currentAccount)
    const balanceReturned = tb()
  } else if (currentSymbol == 'MOVR') {
    const tb = async () => await getMovrBalance(currentAccount)
    const balanceReturned = tb()
  } else if (currentSymbol == 'AUSD') {
    const tb = async () => await getAUSDBalance(currentAccount)
    const balanceReturned = tb()
  }
  return balanceReturned
}
