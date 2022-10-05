import { useState } from 'react'
import { useQuery } from '@apollo/client'

import {
  GET_RESERVE_TOKEN_DATA,
  ReservesTokenGraph,
  ReserveTokenVariables,
} from '@bloxifi/core'

const calculateApyReturn = (
  _rate: number,
  _tokenAmount: number,
  _daysAmount: number,
): number => {
  const monthsAmount = _daysAmount / 30
  const returnAPY = (_rate / 12) * monthsAmount
  const returnValue = _tokenAmount * (1 + returnAPY)
  return returnValue
}

/**
 * Input parameters for useAPY hook
 */
export interface ApyOptions {
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
  readonly simulationType?: string //'Borrow' | 'Deposit' | 'Stake'
}

/**
 * Return type of useAPY hook
 */
export interface ApyReturn {
  /**
   * Calculated Amount of Tokens
   */
  amountReturned: number
  /**
   * Calculated Percent
   */
  amountPercent: number
}

export const useCalculateAPY = ({
  tokenSymbol,
  tokenAmount,
  daysAmount,
  simulationType,
}: ApyOptions = {}): [number, number] => {
  const [calculated, setCalculated] = useState(7)
  const [calculatedPercent, setCalculatedPercent] = useState(0)

  const { data } = useQuery<ReservesTokenGraph, ReserveTokenVariables>(
    GET_RESERVE_TOKEN_DATA,
    {
      variables: {
        symbol: tokenSymbol,
        amount: tokenAmount,
        duration: daysAmount,
      },
      onCompleted: data => {
        if (data) {
          let sendRate = 0
          if (simulationType == 'Deposit') {
            sendRate = data.reserves[0]['recentAvgSupplyAPY']
          } else if (simulationType == 'Borrow') {
            sendRate = data.reserves[0]['recentAvgStableBorrowAPY']
          }
          const calculateReturn = calculateApyReturn(
            sendRate,
            tokenAmount,
            daysAmount,
          )
          setCalculated(calculateReturn)
          const percentReturn = (calculateReturn / tokenAmount) * 100 - 100
          setCalculatedPercent(percentReturn)
        }
      },
    },
  )
  return [calculated, calculatedPercent]
}
