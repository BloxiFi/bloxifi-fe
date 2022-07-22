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
}: FormatAPYOptions = {}): string => {
  //TODO This function seems a bit buggy (keep an eye on this one)
  const getVisibleDecimals = () => {
    if (!value) {
      return 0
    } else if (!decimals) {
      if (percent) {
        return 2
      } else if (value > 1) {
        return 4
      } else {
        return 7
      }
    }
    return decimals
  }

  const visibleDecimals = getVisibleDecimals()

  const minValue = 10 ** -visibleDecimals
  const isSmallerThanMin = value !== 0 && Math.abs(value) < Math.abs(minValue)
  const formattedValue = isSmallerThanMin ? minValue : value

  return `${isSmallerThanMin ? '<' : ''}${formattedValue.toFixed(
    visibleDecimals,
  )}${percent ? '%' : ''}`
}
