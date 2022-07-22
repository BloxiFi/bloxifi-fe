import { gql } from '@apollo/client'

import { TokenList } from '../../contracts'

/**
 * User Reserve Data - Data related to assets deposited by current user
 */
export type UserReserveData = {
  id: string
  currentATokenBalance: string
  currentVariableDebt: string
  currentTotalDebt: string
  reserve: {
    symbol: string
    name: TokenList
    decimals: string
  }
}

/**
 * Reserves Data - Data related to all existing assets
 */
export type ReservesData = {
  id: string
  name: TokenList
  symbol: string
  decimals: number
  totalATokenSupply: number
  totalCurrentVariableDebt: number
  liquidityRate: number
  variableBorrowRate: number
  underlyingAsset: string
}

export interface ReservesGraph {
  reserves: ReservesData[]
  userReserves: UserReserveData[]
}

/**
 * Variables for `GET_RESERVE_DATA` query
 */
export interface UserReserveVariables {
  user: string
}

/**
 * Reserves Data & User reserves data - Fetch all assets and assets deposited by current user
 */
export const GET_RESERVE_DATA = gql`
  query Reserves($user: String) {
    reserves {
      id
      name
      symbol
      decimals
      totalATokenSupply
      totalCurrentVariableDebt
      liquidityRate
      variableBorrowRate
      underlyingAsset
    }
    userReserves(where: { user: $user }) {
      id
      currentATokenBalance
      currentVariableDebt
      currentTotalDebt
      reserve {
        symbol
        name
        decimals
      }
    }
  }
`
