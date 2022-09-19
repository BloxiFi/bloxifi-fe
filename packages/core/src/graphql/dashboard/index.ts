import { gql } from '@apollo/client'
import { BigNumber } from 'ethers'

import { TokenList } from '../../contracts'

/**
 * Dashboard Reserves Data - Data related to all existing assets
 */
export interface DashboardReservesDataQuery {
  id: string
  name: TokenList
  symbol: TokenList
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
`
