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
const calculateTotalBorrow = (array: HealthFactorQuery[]): number => {
  return array.reduce(function (acc, { currentTotalDebt, reserve: { price } }) {
    return (
      acc +
      bigNumberToNumber(currentTotalDebt) * bigNumberToNumber(price.priceInEth)
    )
  }, 0)
}

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

export interface HealthFactorReturnValue extends HealthFactorData {
  /**
   * Method that returns refetched health factor data
   */
  refetchHF: () => void
  ready: boolean
}
/**
 * Hook that returns calculated Health Factor value
 */
export const useHealthFactor = ({
  currentAccount,
}: Props = {}): HealthFactorReturnValue => {
  const [value, setValue] = useState({} as HealthFactorData)

  const { data, refetch, called, loading } = useQuery<
    HealthFactorGraph,
    UserReserveVariables
  >(GET_HEALTH_FACTOR_DATA, {
    variables: {
      user: currentAccount?.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => setData(data.userReserves),
  })
  const refetchData = async () => {
    try {
      const res: { data: HealthFactorGraph } = await refetch()
      setData(res.data.userReserves)
    } catch (error) {
      //@TODOhandle error
    }
  }

  const setData = (userReserves: HealthFactorQuery[]) => {
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
  }

  return {
    ...value,
    refetchHF: refetchData,
    ready: called && !loading && !!data,
  }
}
