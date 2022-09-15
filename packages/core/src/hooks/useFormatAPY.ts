import { TokenList } from '../contracts'

/**
 * Options that can be used to configure useFormatAPY() hook.
 */
export interface FormatAPYOptions {
  /**
   * Represents the number value
   * */
  readonly value?: number
  /**
   * Represents value decimals
   * */
  readonly decimals?: number
  /**
   * This is true if value should be displayed in percentage
   * */
  readonly percent?: boolean
  /**
   * Represents currency symbol
   */
  readonly symbol?: TokenList | 'USD' | ''
  /**
   * Represents the position of the currency symbol related to the value
   * before-symbol goes in front of the value
   * after-symbol goes after value
   */
  readonly symbolPosition?: 'before' | 'after'
  /**
   * Represents the min value to display in UI. E.g. Health factor min value to display is 1.01
   */
  minimumDisplayValue?: number
}

/**
 * Hook that returns a formated string like this `<0.1%`
 *
 * TODO@all rename if we are gonna use it for something else than APY
 * */
export const useFormatAPY = ({
  value = 0,
  decimals,
  percent,
  symbol = '',
  symbolPosition = 'after',
  minimumDisplayValue,
}: FormatAPYOptions = {}): string => {
  //TODO This function seems a bit buggy (keep an eye on this one)
  const getVisibleDecimals = () => {
    if (!value) {
      return 0
    } else if (!decimals) {
      if (percent) {
        return 2
      } else if (value >= 1) {
        return 4
      } else {
        return 7
      }
    }
    return decimals
  }

  const visibleDecimals = getVisibleDecimals()

  const minValue = minimumDisplayValue
    ? minimumDisplayValue
    : 10 ** -visibleDecimals
  const isSmallerThanMin = value !== 0 && Math.abs(value) < Math.abs(minValue)
  const formattedValue = isSmallerThanMin ? minValue : value

  const getSymbol = () => {
    switch (symbol) {
      case 'USD':
        return '$'
      default:
        return symbol
    }
  }

  //If value is smaller than minimum, we display "<" sign before it,
  //In that case symbol should goes after the value
  if (isSmallerThanMin) {
    symbolPosition = 'after'
  }
  const displayValue = `${isSmallerThanMin ? '<' : ''}${formattedValue.toFixed(
    visibleDecimals,
  )}${percent ? '%' : ''}`

  if (symbolPosition === 'before') {
    return `${getSymbol()}${displayValue}`
  } else {
    return `${displayValue}${getSymbol()}`
  }
}
