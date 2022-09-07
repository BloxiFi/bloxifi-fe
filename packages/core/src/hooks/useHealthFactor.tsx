import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { bigNumberToNumber, calculateHealthFactor } from '../utilities'
import { HealthFactorQuery } from '../graphql'

import {
  GET_HEALTH_FACTOR_DATA,
  HealthFactorGraph,
  UserReserveVariables,
} from '@bloxifi/core'

/**
 * Calculate total borrows for current user
 */
const calculateTotalBorrow = (array: HealthFactorQuery[]): number =>
  array.reduce(function (acc, { currentTotalDebt, reserve: { price } }) {
    return (
      acc +
      bigNumberToNumber(currentTotalDebt) * bigNumberToNumber(price.priceInEth)
    )
  }, 0)

/**
 * Calculate total deposited balance for collaterals with asset liquidation threshold
 */
const calculateTotalCollateralWithLT = (array: HealthFactorQuery[]): number => {
  const data = array.filter(reserve => reserve.usageAsCollateralEnabledOnUser)
  return data.reduce(function (
    acc,
    { currentATokenBalance, reserve: { price, reserveLiquidationThreshold } },
  ) {
    return (
      acc +
      bigNumberToNumber(currentATokenBalance) *
        bigNumberToNumber(price.priceInEth) *
        reserveLiquidationThreshold *
        Math.pow(10, -4)
    )
  },
  0)
}

/**
 * Options that can be used to configure useHealthFactor() hook.
 */
export interface Props {
  /**
   * User wallet account
   */
  readonly currentAccount?: string
}

/**
 * Return type of useHealthFactor hook
 */
export interface HealthFactorData {
  /**
   * Calculated health factor value
   */
  healthFactor: number
  /**
   * Sum of total collateral in ETH calculated with asset liquidation threshold
   */
  totalCollateralETH: number
  /**
   * Sum of total borrows for current user
   */
  totalBorrowETH: number
}

/**
 * Hook that returns calculated Health Factor value
 */
export const useHealthFactor = ({
  currentAccount,
}: Props = {}): HealthFactorData => {
  const [value, setValue] = useState({} as HealthFactorData)

  const { data } = useQuery<HealthFactorGraph, UserReserveVariables>(
    GET_HEALTH_FACTOR_DATA,
    {
      variables: {
        user: currentAccount?.toLowerCase(),
      },
      onCompleted: () => {
        const totalBorrowETH = calculateTotalBorrow(data.userReserves)
        const totalCollateralETH = calculateTotalCollateralWithLT(
          data.userReserves,
        )
        setValue({
          healthFactor: calculateHealthFactor({
            totalCollateralETH,
            totalBorrowETH,
          }),
          totalCollateralETH,
          totalBorrowETH,
        })
      },
    },
  )

  return value
}
