import { useState } from 'react'
import { useQuery } from '@apollo/client'

import {
  GET_RESERVE_TOKEN_DATA,
  ReservesTokenGraph,
  ReserveTokenVariables,
} from '@bloxifi/core'

/**
 * Options that can be used to configure useCalculateAPY() hook.
 */
export interface CalculateAPYOptions {
  /**
   * Token symbol from predefined list of accepted tokens
   */
  readonly tokenSymbol?: string
  /**
   * Amount of tokens
   */
  readonly tokenAmount?: number
  /**
   * Number of days
   */
  readonly daysAmount?: number
  /**
   * Type of simulation
   */
  readonly simulationType?: 'vborrow' | 'sborrow' | 'landing' | 'stake'
}

/**
 * Hook that returns calculated value based on passed parameters
 */
export const useCalculateAPY = ({
  tokenSymbol,
  tokenAmount,
  daysAmount,
  simulationType,
}: CalculateAPYOptions = {}): number => {
  const [returnAmount, setReturnAmount] = useState(0)

  const RAY = 10 ** 27
  const SECONDS_PER_YEAR = 31536000
  const SECOND_PER_DAY = 86400

  const { data } = useQuery<ReservesTokenGraph, ReserveTokenVariables>(
    GET_RESERVE_TOKEN_DATA,
    {
      variables: {
        symbol: tokenSymbol,
      },
      onCompleted: () => mapData(),
    },
  )

  const mapData = () => {
    Object.keys(data).map(function (key) {
      const APR = data[key][0]['liquidityRate'] / RAY
      const APY = Math.pow(1 + APR / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1
      const secondsAmount = daysAmount * SECOND_PER_DAY
      //Daily yield = The number of total tokens staked × (APY for the staked token ÷ 365)
      //const returnValue = (daysAmount * (tokenAmount * (APY / 365))) + tokenAmount
      const returnValue = tokenAmount + APY * tokenAmount //APY/secondsAmount ?
      setReturnAmount(returnValue)
      //console.log('APR:', APR, 'APY: ', APY, 'return: ', returnValue)
    })
  }

  return returnAmount
}
