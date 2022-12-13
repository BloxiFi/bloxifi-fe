import { stringToBigNumber } from '@bloxifi/core'
import {
  numberToPercentage,
  sumArrayItems,
  getMinimumValue,
  decimalCount,
} from '../../mappers'

/** Functions to cover:
 * numberToPercentage,
 * sumArrayItems,
 * getMinimumValue,
 * decimalCount,
 */
describe('Number to percentage', () => {
  it('numberToPercentage - whole number', () => {
    const value = 1
    expect(numberToPercentage(value)).toEqual(100)
  })

  it('numberToPercentage - decimal number', () => {
    const value = 0.3324
    expect(numberToPercentage(value)).toEqual(33.24)
  })
})

describe('Sum array of items', () => {
  it('Sum array of items - whole numbers', () => {
    const array = [1, 2, 3, 4]
    expect(sumArrayItems(array)).toEqual(10)
  })

  it('Sum array of items - decimal numbers', () => {
    const array = [1.5, 2.5, 3.5, 4.5]
    expect(sumArrayItems(array)).toEqual(12)
  })
})

describe('Get minimum value', () => {
  it('Get minimum value - whole numbers', () => {
    const list = ['1', '2', '3', '4']
    const expectedResult = '1'

    const input = list.map(num => stringToBigNumber(num))
    expect(getMinimumValue(...input)).toEqual(stringToBigNumber(expectedResult))
  })

  it('Get minimum value - big numbers', () => {
    const list = [
      '123456789123456789.0000000000001',
      '123456789123456789.0000000000002',
      '123456789123456789.0000000000003',
    ]
    const expectedResult = '123456789123456789.0000000000001'

    const input = list.map(num => stringToBigNumber(num))
    expect(getMinimumValue(...input)).toEqual(stringToBigNumber(expectedResult))
  })

  it('Get minimum value - decimal numbers', () => {
    const list = [
      '0.00000000001',
      '0.00000000002',
      '0.00000000003',
      '0.00000000004',
    ]
    const expectedResult = '0.00000000001'

    const input = list.map(num => stringToBigNumber(num))
    expect(getMinimumValue(...input)).toEqual(stringToBigNumber(expectedResult))
  })
})

describe('Count decimals', () => {
  it('Count decimals - whole number - zero decimal places', () => {
    const value = 1
    const expectedResult = 0
    expect(decimalCount(value)).toEqual(expectedResult)
  })

  it('Count decimals - whole number - one decimal place', () => {
    const value = 10.1
    const expectedResult = 1
    expect(decimalCount(value)).toEqual(expectedResult)
  })

  it('Count decimals - decimal number', () => {
    const value = 1.123456789
    const expectedResult = 9
    expect(decimalCount(value)).toEqual(expectedResult)
  })

  it('Count decimals - whole number as string - zero decimal places', () => {
    const value = '1'
    const expectedResult = 0
    expect(decimalCount(value)).toEqual(expectedResult)
  })

  it('Count decimals - whole number as string - one decimal places', () => {
    const value = '10.1'
    const expectedResult = 1
    expect(decimalCount(value)).toEqual(expectedResult)
  })

  it('Count decimals - decimal number as string', () => {
    const value = '1.123456789'
    const expectedResult = 9
    expect(decimalCount(value)).toEqual(expectedResult)
  })
})
