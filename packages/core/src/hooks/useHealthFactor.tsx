import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { bigNumberToNumber } from '../utilities'
import { HealthFactorQuery } from '../graphql'

import {
  GET_HEALTH_FACTOR_DATA,
  HealthFactorGraph,
  UserReserveVariables,
} from '@bloxifi/core'

const calculateTotalBorrow = (array: HealthFactorQuery[]): number =>
  array.reduce(function (acc, { currentTotalDebt, reserve: { price } }) {
    return (
      acc +
      bigNumberToNumber(currentTotalDebt) * bigNumberToNumber(price.priceInEth)
    )
  }, 0)

const calculateTotalCollateralWithLT = (array: HealthFactorQuery[]): number =>
  array.reduce(function (
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
 * Hook that returns calculated Health Factor value
 */
export const useHealthFactor = ({ currentAccount }: Props = {}): number => {
  const [value, setValue] = useState(undefined)

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

        setValue(totalCollateralETH / totalBorrowETH)
      },
    },
  )

  return value
}
