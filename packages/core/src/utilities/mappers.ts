import FEEDER_DATA from '../contracts/staking/staking.json'

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
