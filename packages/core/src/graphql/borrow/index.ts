import { gql } from '@apollo/client'

import { TokenList } from '../../contracts'

export interface DepositGraphVariables {
  orderBy: number
  orderDirection: 'desc' | 'asc'
}

interface User {
  id: string
}

interface Pool {
  lendingPool: string
}

interface DepositData {
  amount: string
  timestamp: number
  user: User
  pool: Pool
}

export interface DepositGraph {
  //TODO@any add all comments for every type in this file.
  deposits: DepositData[]
}

export const GRAPHQLEXAMPLEQUERY = gql`
  query MyQuery {
    deposits(orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
      user {
        id
      }
      pool {
        lendingPool
      }
    }
  }
`
//User Reserve Data - Data related to assets deposited by current user
export interface UserReserveData {
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

//Reserves Data - Data related to all existing assets
export interface ReservesData {
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
//Current user address
export interface UserReserveVariables {
  user: string
}

//Reserves Data & User reserves data - Fetch all assets and assets deposited by current user
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
