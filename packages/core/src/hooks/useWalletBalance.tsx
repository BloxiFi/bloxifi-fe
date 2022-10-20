import { init, toDecimal } from '@moonbeam-network/xcm-sdk'

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

const getMoonriverBalances = async (account: string) => {
  const { moonriver } = init()
  const tokenBalances: TokenBalanceData[] = []
  await moonriver.subscribeToAssetsBalanceInfo(account, balances => {
    balances.forEach(({ asset, balance, origin }) => {
      const singleToken: TokenBalanceData = {
        tokenSymbol: balance.symbol,
        tokenBalance: toDecimal(balance.balance, balance.decimals),
        tokenOrigin: origin.name,
        tokenOriginSymbol: asset.originSymbol,
      }
      tokenBalances.push(singleToken)
    })
  })
  return tokenBalances
}

const getMoonbaseBalances = async (account: string) => {
  const { moonbase } = init()
  const tokenBalances: TokenBalanceData[] = []
  await moonbase.subscribeToAssetsBalanceInfo(account, balances => {
    balances.forEach(({ asset, balance, origin }) => {
      const singleToken: TokenBalanceData = {
        tokenSymbol: balance.symbol,
        tokenBalance: toDecimal(balance.balance, balance.decimals),
        tokenOrigin: origin.name,
        tokenOriginSymbol: asset.originSymbol,
      }
      tokenBalances.push(singleToken)
    })
  })
  return tokenBalances
}

/**
 * Hook that returns Balance of xc Tokens
 */
export const useWalletBalance = ({
  currentAccount,
  currentChainId,
}: Props = {}): TokenBalanceData[] => {
  const balanceReturned: TokenBalanceData[] = []

  if (currentChainId == 1287) {
    const tb = async () => await getMoonbaseBalances(currentAccount)
    const balanceReturned = tb()
  } else if (currentChainId == 1285) {
    const tb = async () => await getMoonriverBalances(currentAccount)
    const balanceReturned = tb()
  }
  return balanceReturned
}
