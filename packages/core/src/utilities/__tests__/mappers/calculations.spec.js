import { BigNumber } from 'ethers'
import {
  calculateHealthFactor,
  calculateAssetCollateralAfterTx,
  getMaxRepayAmount,
  stringToBigNumber,
  numberToBigNumber,
  getMaxBorrowAmount,
  calculateAvailableAssetToBorrow,
  calcBorrowAmountToReachHFLimit,
} from '../../mappers'

/**
 * calculateHealthFactor
 * calculateAssetCollateralAfterTx
 * getMaxRepayAmount
 * calculateAvailableAssetToBorrow
 * calcBorrowAmountToReachHFLimit
 * getMaxBorrowAmount
 */

describe('Calculate health factor', () => {
  it('calculateHealthFactor - whole numbers', () => {
    const totalCollateralETH = '5'
    const totalBorrowETH = '100'
    const expected = totalCollateralETH / totalBorrowETH
    expect(
      calculateHealthFactor({
        totalCollateralETH: stringToBigNumber(totalCollateralETH),
        totalBorrowETH: stringToBigNumber(totalBorrowETH),
      }),
    ).toEqual(expected)
  })

  it('calculateHealthFactor - decimal numbers', () => {
    const totalCollateralETH = '5.1234566789123'
    const totalBorrowETH = '0.123456789'
    const expected = totalCollateralETH / totalBorrowETH
    expect(
      calculateHealthFactor({
        totalCollateralETH: stringToBigNumber(totalCollateralETH),
        totalBorrowETH: stringToBigNumber(totalBorrowETH),
      }),
    ).toEqual(expected)
  })

  it('calculateHealthFactor - big numbers', () => {
    const totalCollateralETH = '5123456678'
    const totalBorrowETH = '123456789'
    const expected = totalCollateralETH / totalBorrowETH
    expect(
      calculateHealthFactor({
        totalCollateralETH: stringToBigNumber(totalCollateralETH),
        totalBorrowETH: stringToBigNumber(totalBorrowETH),
      }),
    ).toEqual(expected)
  })

  it('calculateHealthFactor - empty totalBorrowETH', () => {
    const totalCollateralETH = '5123456678'
    const totalBorrowETH = '0'
    const expected = 0
    expect(
      calculateHealthFactor({
        totalCollateralETH: stringToBigNumber(totalCollateralETH),
        totalBorrowETH: stringToBigNumber(totalBorrowETH),
      }),
    ).toEqual(expected)
  })

  it('calculateHealthFactor - empty totalCollateralETH', () => {
    const totalCollateralETH = '0'
    const totalBorrowETH = '5123456678'
    const expected = 0
    expect(
      calculateHealthFactor({
        totalCollateralETH: stringToBigNumber(totalCollateralETH),
        totalBorrowETH: stringToBigNumber(totalBorrowETH),
      }),
    ).toEqual(expected)
  })
})

describe('Calculate asset collateral after transaction', () => {
  it('calculateAssetCollateralAfterTx - whole numbers', () => {
    const amount = '2'
    const priceInEth = 5
    const reserveLiquidationThreshold = 0.8
    const expected = numberToBigNumber(
      amount * priceInEth * reserveLiquidationThreshold,
      18,
    )
    expect(
      calculateAssetCollateralAfterTx(
        amount,
        priceInEth,
        reserveLiquidationThreshold,
      ),
    ).toEqual(expected.toString())
  })

  it('calculateAssetCollateralAfterTx - decimal numbers', () => {
    const amount = '1.234567891234'
    const priceInEth = 5.123456
    const reserveLiquidationThreshold = 0.8
    const expected = '5060203415800147763' // amount * 10 ** 18
    expect(
      calculateAssetCollateralAfterTx(
        amount,
        priceInEth,
        reserveLiquidationThreshold,
      ),
    ).toEqual(expected)
  })

  it('calculateAssetCollateralAfterTx - big numbers', () => {
    const amount = '100000001'
    const priceInEth = 5000
    const reserveLiquidationThreshold = 0.8
    const expected = '400000004000000000000000000000' //400000004000 * 10 ** 18
    expect(
      calculateAssetCollateralAfterTx(
        amount,
        priceInEth,
        reserveLiquidationThreshold,
      ),
    ).toEqual(expected)
  })
})

describe('Get max repay amount', () => {
  it('getMaxRepayAmount - big numbers', () => {
    const balance = '100000001'
    const currentTotalDebt = '5000'
    expect(getMaxRepayAmount(balance, currentTotalDebt)).toEqual(
      currentTotalDebt,
    )
  })

  it('getMaxRepayAmount - decimal numbers', () => {
    const balance = '0.100000006'
    const currentTotalDebt = '0.1000000056'
    expect(getMaxRepayAmount(balance, currentTotalDebt)).toEqual(
      currentTotalDebt,
    )
  })
})

describe('Get max borrow amount', () => {
  it('getMaxBorrowAmount - big numbers', () => {
    const aTokenBalance = stringToBigNumber('100000')
    const availableBorrowsETH = stringToBigNumber('1000')
    const priceInEth = 1.12345
    const totalCollateralETH = stringToBigNumber('200')
    const totalDebtETH = stringToBigNumber('10')

    expect(
      getMaxBorrowAmount({
        aTokenBalance,
        availableBorrowsETH,
        priceInEth,
        totalCollateralETH,
        totalDebtETH,
      }),
    ).toEqual(BigNumber.from('167359279339782787701'))
  })
})

describe('Calculate available assets to borrow - based on collateral and total borrow', () => {
  it('calculateAvailableAssetToBorrow ', () => {
    const availableBorrowsETH = stringToBigNumber('1000')
    const priceInEth = 1.12345

    expect(
      calculateAvailableAssetToBorrow(availableBorrowsETH, priceInEth),
    ).toEqual(BigNumber.from('881214117228181049445'))
  })
})

describe('Calculate Borrow amount to reach min HF limit', () => {
  it('calcBorrowAmountToReachHFLimit ', () => {
    const totalCollateralETH = stringToBigNumber('200')
    const totalDebtETH = stringToBigNumber('10')
    const priceInEth = 1.12345

    expect(
      calcBorrowAmountToReachHFLimit(
        totalCollateralETH,
        totalDebtETH,
        priceInEth,
      ),
    ).toEqual(BigNumber.from('167359279339782787701'))
  })
})

describe('Get max borrow amount', () => {
  it('getMaxBorrowAmount ', () => {
    const aTokenBalance = stringToBigNumber('100000')
    const availableBorrowsETH = stringToBigNumber('1000')
    const priceInEth = 1.12345
    const totalCollateralETH = stringToBigNumber('200')
    const totalDebtETH = stringToBigNumber('10')

    expect(
      getMaxBorrowAmount({
        aTokenBalance,
        availableBorrowsETH,
        priceInEth,
        totalCollateralETH,
        totalDebtETH,
      }),
    ).toEqual(BigNumber.from('167359279339782787701'))
  })
})
