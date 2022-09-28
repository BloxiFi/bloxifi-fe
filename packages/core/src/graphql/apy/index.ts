import { gql } from '@apollo/client'

/**
 * Reserves Data - Data related to one asset
 */
export interface ReservesTokenDataQuery {
  symbol: string
  liquidityRate: number
  variableBorrowRate: number
  stableBorrowRate: number
  recentAvgSupplyAPY: number
  recentAvgStableBorrowAPY: number
  recentAvgVariableBorrowAPY: number
}

export interface ReservesTokenGraph {
  reserves: ReservesTokenDataQuery
}

/**
 * Variables for `GET_RESERVE_TOKEN_DATA` query
 */
export interface ReserveTokenVariables {
  symbol: string
  amount: number
  duration: number
}

/**
 * Reserves Data - Fetch one assets
 */
export const GET_RESERVE_TOKEN_DATA = gql`
  query getReserves($symbol: String) {
    reserves(where: { symbol: $symbol }) {
      symbol
      liquidityRate
      variableBorrowRate
      stableBorrowRate
      recentAvgSupplyAPY
      recentAvgStableBorrowAPY
      recentAvgVariableBorrowAPY
    }
  }
`

/* export const GET_RESERVE_TOKEN_DATA = gql`
  query Reserves($symbol: String) {
    reserves(where: { symbol: $symbol}) {
      id
      name
      symbol
      decimals
      totalATokenSupply
      totalCurrentVariableDebt
      liquidityRate
      variableBorrowRate
      stableBorrowRate
      underlyingAsset
      price {
        priceInEth
        oracle {
          usdPriceEth
        }
      }
    }
  }
` */
