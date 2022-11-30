import { MAX_AMOUNT_DECIMALS } from './config'

/**
 * Function that calculates number of decimals in a number or string
 * @param value Represents the amount as number or string
 * @returns Number of decimals
 */
export const countNumberOfDecimals = (value: string | number): number => {
  const string = String(value)
  if (!!string && string.includes('.')) {
    return string.split('.')[1].length
  }
  return 0
}

/**
 * Function that check if number of decimals is in scope of defined max number of decimals
 * @param value Represents the amount as number or string
 * @param max Represents the maximum number of decimals
 * @param maxIncluded Represents boolean value if the max param should be included in scope
 * @returns Boolean value, true if number of decimals is in defined max scope
 */
export const isAllowedNumberOfDecimals = (
  value: string | number,
  max: number = MAX_AMOUNT_DECIMALS,
  maxIncluded = true,
): boolean => {
  if (maxIncluded) {
    return countNumberOfDecimals(value) <= max
  }
  return countNumberOfDecimals(value) < max
}
