import { ethers } from 'ethers'
import { ETHER_DECIMALS } from '../../config'
import {
  convertBalancesInUsdArray,
  convertETHToAssetValue,
  convertToUSD,
  convertUSDToAssetValue,
  getDepositedAssetsUSD,
  stringToBigNumber,
} from '../../mappers'
/**
 * convertToUSD
 * convertUSDToAssetValue
 * convertETHToAssetValue
 * convertBalancesInUsdArray
 * getDepositedAssetsUSD
 */

let coinDecimals = 18

describe('Convert to USD', () => {
  it('Convert to USD - whole numbers', () => {
    const value = 10
    const priceInEth = 1
    const usdPriceInEth = 2

    expect(convertToUSD(value, priceInEth, usdPriceInEth)).toEqual(20)
  })

  it('Convert to USD - big whole numbers', () => {
    const value = 123000000000
    const priceInEth = 2000000000
    const usdPriceInEth = 2000000000

    expect(convertToUSD(value, priceInEth, usdPriceInEth)).toEqual(4.92e29)
  })

  it('Convert to USD - big decimals', () => {
    //WILL FAIL WITH 0.0000000000001
    const value = 0.000000000001
    const priceInEth = 1.5
    const usdPriceInEth = 2

    expect(convertToUSD(value, priceInEth, usdPriceInEth)).toEqual(
      0.000000000003,
    )
  })
})

describe('Convert USD to asset value', () => {
  it('Convert USD to asset value - whole numbers', () => {
    const value = 10
    const priceInEth = 1
    const usdPriceInEth = 2

    expect(convertUSDToAssetValue(value, priceInEth, usdPriceInEth)).toEqual(5)
  })

  it('Convert USD to asset value - big whole numbers', () => {
    const value = 123000000000
    const priceInEth = 2000000000
    const usdPriceInEth = 2000000000

    expect(convertUSDToAssetValue(value, priceInEth, usdPriceInEth)).toEqual(
      3.075e-8,
    )
  })

  it('Convert USD to asset value - big decimals', () => {
    const value = 0.000000000001
    const priceInEth = 1.5
    const usdPriceInEth = 2

    expect(convertUSDToAssetValue(value, priceInEth, usdPriceInEth)).toEqual(
      3.3333333333333334e-13,
    )
  })
})

describe('Convert ETH to asset value', () => {
  it('Convert ETH to asset value - whole numbers', () => {
    const value = '10'
    const priceInEth = '1'
    expect(
      convertETHToAssetValue(
        stringToBigNumber(value, coinDecimals),
        stringToBigNumber(priceInEth, ETHER_DECIMALS),
      ),
    ).toEqual(stringToBigNumber('10', coinDecimals))
  })

  it('Convert ETH to asset value - big whole numbers', () => {
    const value = '123000000000'
    const priceInEth = '2000000000'
    expect(
      convertETHToAssetValue(
        stringToBigNumber(value, coinDecimals),
        stringToBigNumber(priceInEth, ETHER_DECIMALS),
      ),
    ).toEqual(stringToBigNumber('61.5', coinDecimals))
  })

  it('Convert ETH to asset value - big decimals', () => {
    const value = '0.000000000001'
    const priceInEth = '1.5'
    coinDecimals = 12
    expect(
      convertETHToAssetValue(
        stringToBigNumber(value, coinDecimals),
        stringToBigNumber(priceInEth, ETHER_DECIMALS),
      ),
    ).toEqual(stringToBigNumber('0', coinDecimals))
  })

  it('stringToBigNumber - big decimal numbers', () => {
    const unit = 12
    const value = '0.000000000001'

    expect(stringToBigNumber(value, unit)).toEqual(
      ethers.utils.parseUnits('0.000000000001', unit),
    )
  })
})

describe('Convert balances in USD array', () => {
  it('convertBalancesInUsdArray', () => {
    const arr = [
      {
        priceInEth: 1,
        usdPriceEth: 2,
        balance: 6,
      },
      {
        priceInEth: 0.00000001,
        usdPriceEth: 1.23456789,
        balance: 4.321123,
      },
      {
        priceInEth: 10000000,
        usdPriceEth: 2000000,
        balance: 3000000,
      },
    ]
    expect(convertBalancesInUsdArray(arr, 'balance')).toEqual([
      12, 5.33471970454047e-8, 60000000000000000000,
    ])
  })
})

describe('Get deposited assets in USD array', () => {
  it('getDepositedAssetsUSD - whole numbers', () => {
    const currentATokenBalance = 1
    const priceInEth = 2
    const usdPriceEth = 3
    const usageAsCollateralEnabledOnUser = true
    const baseLTVasCollateral = 0.4
    expect(
      getDepositedAssetsUSD({
        currentATokenBalance,
        priceInEth,
        usdPriceEth,
        usageAsCollateralEnabledOnUser,
        baseLTVasCollateral,
      }),
    ).toEqual(2.4000000000000004)
  })

  it('getDepositedAssetsUSD - decimal numbers', () => {
    const currentATokenBalance = 1.123456789999
    const priceInEth = 2.123456789999
    const usdPriceEth = 3.123456789999
    const usageAsCollateralEnabledOnUser = true
    const baseLTVasCollateral = 0.4
    expect(
      getDepositedAssetsUSD({
        currentATokenBalance,
        priceInEth,
        usdPriceEth,
        usageAsCollateralEnabledOnUser,
        baseLTVasCollateral,
      }),
    ).toEqual(2.980542336155045)
  })

  it('getDepositedAssetsUSD - big numbers', () => {
    const currentATokenBalance = 123456789999
    const priceInEth = 123456
    const usdPriceEth = 3123456789999
    const usageAsCollateralEnabledOnUser = true
    const baseLTVasCollateral = 0.4
    expect(
      getDepositedAssetsUSD({
        currentATokenBalance,
        priceInEth,
        usdPriceEth,
        usageAsCollateralEnabledOnUser,
        baseLTVasCollateral,
      }),
    ).toEqual(1.9042443509994255e28)
  })
})
