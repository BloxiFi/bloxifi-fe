import { useCallback, useState } from 'react'
import { useQuery } from '@apollo/client'
import { BigNumber } from 'ethers'

import {
  calculateHealthFactor,
  getNetworkByChain,
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
const calculateTotalBorrow = (array: HealthFactorQuery[]): BigNumber => {
  let totalBorrow = BigNumber.from(0)
  for (const item of array) {
    const currentTotalDebt = BigNumber.from(item.currentTotalDebt) //TODO  check decimals
    const priceInEth = BigNumber.from(item.reserve.price.priceInEth)
    totalBorrow = totalBorrow.add(
      currentTotalDebt.mul(priceInEth).div(SCALING_FACTOR),
    )
  }
  return totalBorrow
}

/**
 * Calculate total deposited balance for collaterals with asset liquidation threshold
 * ∑Collateral in ETH × LiquidationThreshold
 */
const calculateTotalCollateralWithLT = (
  array: HealthFactorQuery[],
): BigNumber => {
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
          .div(SCALING_FACTOR_LT),
      )
    }
  }
  return totalCollateral
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
  totalCollateralETH: BigNumber
  /**
   * Sum of total borrows for current user
   */
  totalBorrowETH: BigNumber
}

/**
 * Hook that returns calculated Health Factor value
 */
export const useHealthFactor = ({
  currentAccount,
}: Props = {}): HealthFactorData => {
  const [value, setValue] = useState({} as HealthFactorData)
  const CHAIN_ID = Number(process.env.CHAIN_ID) || 1287
  const configAssets = getNetworkByChain(CHAIN_ID).configAssets

  const mapUserReserveData = useCallback(
    ({ reserve: { symbol, ...restReserve }, ...rest }): HealthFactorQuery => {
      return {
        ...rest,
        reserve: {
          ...restReserve,
          symbol,
          decimals: configAssets[symbol].decimals,
          underlyingAsset: configAssets[symbol].underlyingAsset,
        },
      }
    },
    [configAssets],
  )

  const { data } = useQuery<HealthFactorGraph, UserReserveVariables>(
    GET_HEALTH_FACTOR_DATA,
    {
      variables: {
        user: currentAccount?.toLowerCase(),
      },
      fetchPolicy: 'cache-and-network',
      onCompleted: () => {
        const userReserves = data.userReserves.map(mapUserReserveData)
        const totalBorrowETH = calculateTotalBorrow(userReserves)
        const totalCollateralETH = calculateTotalCollateralWithLT(userReserves)
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
