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

export const RAW_USER_RESERVES = gql`
  query RawReserve($user: String) {
    userReserves(where: { user: $user }) {
      principalATokenBalance
      userBalanceIndex
      redirectedBalance
      interestRedirectionAddress
      reserve {
        id
        underlyingAsset
        name
        symbol
        decimals
        liquidityRate
        reserveLiquidationBonus
        lastUpdateTimestamp
        aToken {
          id
        }
      }
      usageAsCollateralEnabledOnUser
      borrowRate
      borrowRateMode
      originationFee
      principalBorrows
      variableBorrowIndex
      lastUpdateTimestamp
    }
  }
`

export const POOL_RESERVES_DATA = gql`
  query PoolReserve($user: String) {
    reserves(where: { pool: "0x52a0b43a8249f1e883c07be2cf9ff06a6b366924" }) {
      id
      underlyingAsset
      name
      symbol
      decimals
      isActive
      isFrozen
      usageAsCollateralEnabled
      borrowingEnabled
      stableBorrowRateEnabled
      baseLTVasCollateral
      optimalUtilisationRate
      averageStableRate
      stableRateSlope1
      stableRateSlope2
      baseVariableBorrowRate
      variableRateSlope1
      variableRateSlope2
      variableBorrowIndex
      variableBorrowRate
      totalScaledVariableDebt
      liquidityIndex
      reserveLiquidationThreshold
      aToken {
        id
      }
      vToken {
        id
      }
      sToken {
        id
      }
      availableLiquidity
      stableBorrowRate
      liquidityRate
      totalPrincipalStableDebt
      totalLiquidity
      utilizationRate
      reserveLiquidationBonus
      price {
        priceInEth
      }
      lastUpdateTimestamp
      stableDebtLastUpdateTimestamp
      reserveFactor
    }
  }
`

export const PRICE_ORACLE = gql`
  query PriceOracle {
    priceOracle(id: "1") {
      usdPriceEth
    }
  }
`
