import { BigNumber, ethers } from 'ethers'
import { UserReserveData } from '@/containers/WalletContainer'

/**
 * Wait before executing
 * @param ms Number of milliseconds to wait before executing
 * @returns
 */
export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const filterItems = (items, filter, filterBy) => {
  if (filter.trim().length === 0) {
    return items
  }
  return items.filter(
    filterItem =>
      filterItem[filterBy].toLowerCase().search(filter.toLowerCase()) !== -1,
  )
}

/**
 * sliceMiddleOfString
 * @param string String that needs to be sliced
 * @param n Number of first and last characters to display
 * @returns string
 */
export const sliceMiddleOfString = (string: string, n: number): string =>
  `${string.slice(0, n)}...${string.slice(string.length - n)}`

export function getContract<Contract>(
  value: Contract = {} as Contract,
  contractName: keyof Contract,
  type: keyof Contract[keyof Contract],
): any {
  return value[contractName] ? value[contractName][type] : null
}

export function numberToPercentage(value: number): number {
  // toFixed(2) will round it if there is more decimals 10.00001=>10.00
  //and toPrecision will reduce decimals if number is 10.00 to 10
  const percentage = value * 100
  return Number(Number(percentage.toFixed(2)).toPrecision())
}

export function bigNumberToString(value: BigNumber): string {
  return ethers.utils.formatUnits(value)
}

export function bigNumberToNumber(value: BigNumber): number {
  return Number(bigNumberToString(value))
}

export const sumArrayItems = (array: number[]): number =>
  array.reduce((partialSum, a) => partialSum + a, 0)

/**
 * convertToUSD function converts asset value to USD
 * @param balance Asset balance
 * @param priceInEth Asset price in ETH, 1asset = priceInEth ETH
 * @param usdPriceEth Eth price in USD, 1ETH = usdPriceEth USD
 * @returns balance value converted in USD
 */
export const convertToUSD = (
  balance: number,
  priceInEth: number,
  usdPriceEth: number,
) => {
  const balanceInEth = balance * priceInEth
  const balanceInUsd = balanceInEth * usdPriceEth
  return balanceInUsd
}

/**
 * convertUSDToAssetValue function converts USD to asset value. E.g. 1000USD converts to KSM
 * @param value Value in USD
 * @param priceInEth Asset price in ETH, 1asset = priceInEth ETH
 * @param usdPriceEth Eth price in USD, 1ETH = usdPriceEth USD
 * @returns converted USD value in selected asset
 */
export const convertUSDToAssetValue = (
  value: number,
  priceInEth: number,
  usdPriceEth: number,
) => {
  return value / (priceInEth * usdPriceEth)
}

type BalanceField =
  | 'balance'
  | 'currentATokenBalance'
  | 'currentTotalDebt'
  | 'totalCurrentVariableDebt'
  | 'totalATokenSupply'

type ReserveArrayItem = {
  /**
   * Asset price in ETH, e.g. 1KSMmb = priceInEth ETH
   */
  priceInEth: number
  /**
   * Eth price in USD, 1ETH = usdPriceEth USD
   */
  usdPriceEth: number
  //TODO add type for balance prop as BalanceField
  [x: string]: any //the rest of object props, not important for this function call
}

/**
 * convertBalancesInUsdArray function returns array of assets balance values, converted from asset currency to USD
 * @param reserveArray Array of objects which contain asset balance and currencies prices (ETH & USD)
 * @param balanceField Here we want to pass the name of balance prop inside an reserveArray object, so we can access it like reserveArray[balanceField]
 * @returns array of balances converted in USD
 */
export const convertBalancesInUsdArray = (
  reserveArray: ReserveArrayItem[],
  balanceField: BalanceField = 'balance',
): number[] =>
  reserveArray.map((reserve: ReserveArrayItem) => {
    const { [balanceField]: balance, priceInEth, usdPriceEth } = reserve

    return convertToUSD(balance, priceInEth, usdPriceEth)
  })

/**
 * Calculate total deposits of asset denominated in USD, multiplied by its LTV
 * @param currentATokenBalance total deposits of X token
 * @param priceInEth Asset price in ETH, e.g. 1KSMmb = priceInEth ETH
 * @param usdPriceEth Eth price in USD, 1ETH = usdPriceEth USD
 * @param usageAsCollateralEnabledOnUser
 * * @param baseLTVasCollateral  LTV(Loan to Value of X token), the maximum amount of currency that can be borrowed
 * @returns number,  total deposits of asset denominated in USD, multiplied by its LTV
 */

type GetDepositAssetUSD = Pick<
  UserReserveData,
  | 'currentATokenBalance'
  | 'priceInEth'
  | 'usdPriceEth'
  | 'usageAsCollateralEnabledOnUser'
  | 'baseLTVasCollateral'
>
export const getDepositedAssetsUSD = ({
  currentATokenBalance,
  priceInEth,
  usdPriceEth,
  usageAsCollateralEnabledOnUser,
  baseLTVasCollateral,
}: GetDepositAssetUSD): number => {
  if (usageAsCollateralEnabledOnUser) {
    //total deposits of X asset denominated in USD
    const depositAssetUSD = convertToUSD(
      Number(currentATokenBalance),
      priceInEth,
      usdPriceEth,
    )
    return depositAssetUSD * baseLTVasCollateral
  }
  return 0
}

/**
 * Calculate health factor
 * totalCollateralETH is sum of collaterals expressed in ETH
 * totalDebtETH is sum of borrows expressed in ETH
 */
export const calculateHealthFactor = ({
  totalCollateralETH,
  totalBorrowETH,
}: {
  totalCollateralETH: number
  totalBorrowETH: number
}): number => {
  return totalCollateralETH / totalBorrowETH
}

/**
 * Calculate asset collateral value for the potential transaction (In order to calculate future health factor in most cases)
 * @param amount Desired amount for the transaction. E.g. The amount that user wants to deposit
 * @param priceInEth Asset price in ETH, e.g. 1KSMmb = priceInEth ETH
 * @param reserveLiquidationThreshold LiquidationThreshold for the selected asset
 * LiquidationThreshold - the percentage at which a position is defined as undercollateralised.
 * For example, a Liquidation threshold of 80% means that if the value rises above 80% of the collateral, the position is undercollateralised and could be liquidated.
 */
export const calculateAssetCollateralAfterTx = (
  amount: string | number,
  priceInEth: number,
  reserveLiquidationThreshold: number,
): number => {
  return Number(amount) * priceInEth * reserveLiquidationThreshold
}

/**
 * Maximum amount that can be repayed is min value of the current token balance or current token borrow debt.
 * @param balance Current token balance
 * @param currentTotalDebt Current token borrow debt
 * @returns Maximum amount that can be repayed
 */
export const getMaxRepayAmount = (
  balance: string,
  currentTotalDebt: string,
): string => {
  if (Number(balance) < Number(currentTotalDebt)) {
    return balance
  }
  return currentTotalDebt
}
