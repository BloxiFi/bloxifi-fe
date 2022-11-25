import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BigNumber } from 'ethers'

import {
  calculateHealthFactor,
  SCALING_FACTOR,
  SCALING_FACTOR_LT,
} from '../utilities'
import { HealthFactorQuery } from '../graphql'

import {
  GET_HEALTH_FACTOR_DATA,
  HealthFactorGraph,
  UserReserveVariables,
} from '@bloxifi/core'

/**
 * Calculate total borrows for current user
 */
const calculateTotalBorrow = (array: HealthFactorQuery[]): string => {
  let totalBorrow = BigNumber.from(0)
  for (const item of array) {
    const currentTotalDebt = BigNumber.from(item.currentTotalDebt)
    const priceInEth = BigNumber.from(item.reserve.price.priceInEth)
    totalBorrow = totalBorrow.add(
      currentTotalDebt.mul(priceInEth).div(SCALING_FACTOR),
    )
  }
  return totalBorrow.toString()
}

/**
 * Calculate total deposited balance for collaterals with asset liquidation threshold
 * ∑Collateral in ETH × LiquidationThreshold
 */
const calculateTotalCollateralWithLT = (array: HealthFactorQuery[]): any => {
  let totalCollateral = BigNumber.from(0)

  for (const item of array) {
    const currentATokenBalance = BigNumber.from(item.currentATokenBalance)
    const priceInEth = BigNumber.from(item.reserve.price.priceInEth)
    const reserveLiquidationThreshold = BigNumber.from(
      item.reserve.reserveLiquidationThreshold,
    )
    if (item.usageAsCollateralEnabledOnUser) {
      totalCollateral = totalCollateral.add(
        currentATokenBalance
          .mul(priceInEth)
          .div(SCALING_FACTOR)
          .mul(reserveLiquidationThreshold)
          .div(SCALING_FACTOR_LT)
          .toString(),
      )
    }
  }
  return totalCollateral.toString()
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
  totalCollateralETH: string
  /**
   * Sum of total borrows for current user
   */
  totalBorrowETH: string
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
      fetchPolicy: 'cache-and-network',
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
