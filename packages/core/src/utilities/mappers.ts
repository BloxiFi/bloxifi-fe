import { BigNumber, ethers } from 'ethers'

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

export function bigNumberToNumber(value: BigNumber): number {
  return Number(ethers.utils.formatUnits(value))
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
