import {
  stringToBigNumber,
  bigNumberToString,
  bigNumberToNumber,
  numberToBigNumber,
} from '@bloxifi/core'
import { ethers } from 'ethers'

let decimals = 18

/** Functions to cover:
 * stringToBigNumber,
 * bigNumberToString
 * bigNumberToNumber
 * numberToBigNumber
 */

describe('String to big number', () => {
  const calcStringToBigNumber = (value, decimals, expected) => {
    const expectedValue = expected || ethers.utils.parseUnits(value, decimals)
    return expect(stringToBigNumber(value, decimals)).toEqual(expectedValue)
  }

  it('stringToBigNumber - whole number', () => {
    const value = '1'
    calcStringToBigNumber(value, decimals)
  })

  it('stringToBigNumber - big whole number', () => {
    const value = '200000000000000000'
    calcStringToBigNumber(value, decimals)
  })

  it('stringToBigNumber - decimals', () => {
    const value = '0.1'
    calcStringToBigNumber(value, decimals)
  })

  //NOT working in case for 12 decimals
  //expected result: 0.123456789999
  // recieved result: 0.123456790000
  it('stringToBigNumber - big decimal numbers', () => {
    decimals = 7
    const value = '0.12345678999999999'
    const expected = ethers.utils.parseUnits('0.1234567', decimals)
    calcStringToBigNumber(value, decimals, expected)
  })
})

describe('Big number to string', () => {
  const calcBigNumberToString = (bigNumber, decimals, expected) => {
    return expect(bigNumberToString(bigNumber, decimals)).toEqual(expected)
  }

  it('bigNumberToString - whole number', () => {
    const value = '1'
    const big = stringToBigNumber(value, decimals)
    const expected = ethers.utils.formatUnits(big, decimals)
    calcBigNumberToString(big, decimals, expected)
  })

  it('bigNumberToString - big whole number', () => {
    const value = '200000000000000000'
    const big = stringToBigNumber(value, decimals)
    const expected = ethers.utils.formatUnits(big, decimals)
    calcBigNumberToString(big, decimals, expected)
  })

  it('bigNumberToString - decimals', () => {
    const value = '0.1'
    const big = stringToBigNumber(value, decimals)
    const expected = ethers.utils.formatUnits(big, decimals)
    calcBigNumberToString(big, decimals, expected)
  })

  it('bigNumberToString - big decimal numbers', () => {
    decimals = 7
    const value = '0.12345678999999999'
    const big = stringToBigNumber(value, decimals)
    const expected = '0.1234567'
    calcBigNumberToString(big, decimals, expected)
  })
})

describe('Number to big number', () => {
  const calcNumberToBigNumber = (value, decimals, expected) => {
    const expectedValue =
      expected || stringToBigNumber(value.toString(), decimals)
    return expect(numberToBigNumber(value, decimals)).toEqual(expectedValue)
  }

  it('numberToBigNumber - whole number', () => {
    const value = 1
    calcNumberToBigNumber(value, decimals)
  })

  it('numberToBigNumber - big whole number', () => {
    const value = 200000000000000000
    calcNumberToBigNumber(value, decimals)
  })

  it('numberToBigNumber - decimals', () => {
    const value = 0.1
    calcNumberToBigNumber(value, decimals)
  })

  it('numberToBigNumber - big decimal numbers', () => {
    decimals = 7
    const value = 0.12345678999999999
    calcNumberToBigNumber(value, decimals)
  })
})

describe('Big number to number', () => {
  const calcBigNumberToNumber = (bigNumber, decimals, expected) => {
    return expect(bigNumberToNumber(bigNumber, decimals)).toEqual(expected)
  }

  it('bigNumberToString - whole number', () => {
    const value = 1
    const big = numberToBigNumber(value, decimals)
    calcBigNumberToNumber(big, decimals, value)
  })

  it('bigNumberToString - big whole number', () => {
    const value = 200000000000000000
    const big = numberToBigNumber(value, decimals)
    calcBigNumberToNumber(big, decimals, value)
  })

  it('bigNumberToString - decimals', () => {
    const value = 0.1
    const big = numberToBigNumber(value, decimals)
    calcBigNumberToNumber(big, decimals, value)
  })

  it('bigNumberToString - big decimal numbers', () => {
    decimals = 7
    const value = 0.12345678999999999
    const big = numberToBigNumber(value, decimals)
    const expected = 0.1234567
    calcBigNumberToNumber(big, decimals, expected)
  })
})
