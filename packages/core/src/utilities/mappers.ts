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
