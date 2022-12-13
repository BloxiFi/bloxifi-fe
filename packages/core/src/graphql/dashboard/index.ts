import { gql } from '@apollo/client'
import { BigNumber } from 'ethers'

/**
 * Dashboard Reserves Data - Data related to all existing assets
 */
export interface DashboardReservesDataQuery {
  id: string
  name: string
  symbol: string
  decimals: number
  totalATokenSupply: BigNumber
  totalCurrentVariableDebt: BigNumber
  liquidityRate: number
  variableBorrowRate: number
  underlyingAsset: string
  price: {
    priceInEth: BigNumber
    oracle: {
      usdPriceEth: BigNumber
    }
  }
}

export interface DashboardReservesGraph {
  reserves: DashboardReservesDataQuery[]
}

/**
 * Fetch data related to all existing assets
 */
export const GET_DASHBOARD_RESERVE_DATA = gql`
  query Reserves {
    reserves {
      id
      name
      symbol
      totalATokenSupply
      totalCurrentVariableDebt
      liquidityRate
      variableBorrowRate
      stableBorrowRate
      price {
        priceInEth
        oracle {
          usdPriceEth
        }
      }
    }
  }
`
