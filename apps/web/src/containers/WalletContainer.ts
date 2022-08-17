import { useQuery } from '@apollo/client'
import {
  bigNumberToNumber,
  BorrowAndLending,
  GET_RESERVE_DATA,
  ReservesDataQuery,
  ReservesGraph,
  TokenContract,
  TokenList,
  Tokens,
  UserReserveDataQuery,
  UserReserveVariables,
} from '@bloxifi/core'
import Assets from '@bloxifi/core/src/utilities/assets.json'
import { Action } from '@bloxifi/types'
import {
  Dispatch,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { createContainer } from 'unstated-next'

import { Web3Container } from './Web3Container'

type DefaultReserveData = {
  id: string
  name: TokenList
  fullName: string
  symbol: TokenList
  icon: string
  decimals: number
  balance: number
  supplyAPY: number
  liquidityRate: number
  variableBorrowAPY: number
  underlyingAsset: string
  priceInEth: number
  usdPriceEth: number
}
export type ReservesData = DefaultReserveData & {
  totalATokenSupply: number
  totalCurrentVariableDebt: number
}

export type UserReserveData = DefaultReserveData & {
  currentATokenBalance: number
  currentVariableDebt: string
  currentTotalDebt: number
  usageAsCollateralEnabledOnUser: boolean
}

export type UserAccountData = {
  totalDebtETH: number
  availableBorrowsETH: number
  healthFactor: number
}

interface State {
  reserves: ReservesData[]
  userReserves: UserReserveData[]
  userAccountData: UserAccountData
  error?: Error
  loading: boolean
}

interface DepositContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType =
  | 'setReserveData'
  | 'setUserReservesData'
  | 'setUserAccountData'

const defaultState = {
  reserves: [],
  userReserves: [],
  userAccountData: {} as UserAccountData,
  error: undefined,
  loading: false,
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setReserveData': {
      return {
        ...state,
        reserves: action.value,
      }
    }
    case 'setUserReservesData': {
      return {
        ...state,
        userReserves: action.value,
      }
    }
    case 'setUserAccountData': {
      return {
        ...state,
        userAccountData: action.value,
      }
    }
    default:
      return defaultState
  }
}

// Deposit and Borrow APY calculation
const calculateAPY = (liquidityRate: number, inPercents = true) => {
  const RAY = 10 ** 27
  const SECONDS_PER_YEAR = 31536000

  const APR = liquidityRate / RAY
  const APY = Math.pow(1 + APR / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1

  return inPercents ? APY * 100 : APY
}

function useWallet(initialState: State = defaultState): DepositContainerState {
  const [state, dispatch] = useReducer<Reducer<State, Action<ActionType>>>(
    reducer,
    initialState,
  )

  const {
    state: { currentAccount, signer },
  } = Web3Container.useContainer()
  const [error, setError] = useState<Error | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  const { data } = useQuery<ReservesGraph, UserReserveVariables>(
    GET_RESERVE_DATA,
    {
      variables: {
        user: currentAccount?.toLowerCase(),
      },
    },
  )

  const getUserAccountData = useCallback(async () => {
    try {
      const lendingPoolContract =
        BorrowAndLending.lendingPool.getLendingPoolContract(signer)
      const response = await BorrowAndLending.lendingPool.getUserAccountData(
        lendingPoolContract,
        currentAccount,
      )

      dispatch({
        type: 'setUserAccountData',
        value: {
          healthFactor: bigNumberToNumber(response.healthFactor),
          availableBorrowsETH: bigNumberToNumber(response.availableBorrowsETH),
          totalDebtETH: bigNumberToNumber(response.totalDebtETH),
        },
      })
    } catch (error) {
      setError(error)
    }
  }, [currentAccount, signer])

  const getReserveBalance = useCallback(
    async (name: TokenList) => {
      try {
        const tokenContract: TokenContract = Tokens.getTokenContract(
          signer,
          name,
        )

        const balance = await Tokens.getTokenBalance(
          tokenContract,
          currentAccount,
        )
        setError(undefined)
        return balance
      } catch (error) {
        setError(error)
      }
    },
    [currentAccount, signer],
  )

  const setReserveData = useCallback(
    async (reserves: ReservesDataQuery[]) => {
      try {
        const reserveData = await Promise.all(
          reserves.map(async (reserve: ReservesDataQuery) => {
            const balance = await getReserveBalance(reserve.name)
            return {
              ...reserve,
              balance: bigNumberToNumber(balance),
              icon: Assets[reserve.symbol].icon,
              fullName: Assets[reserve.symbol].fullName,
              supplyAPY: calculateAPY(reserve.liquidityRate),
              variableBorrowAPY: calculateAPY(reserve.variableBorrowRate),
              priceInEth: bigNumberToNumber(reserve.price.priceInEth),
              usdPriceEth: bigNumberToNumber(reserve.price.oracle.usdPriceEth),
              totalATokenSupply: bigNumberToNumber(reserve.totalATokenSupply),
              totalCurrentVariableDebt: bigNumberToNumber(
                reserve.totalCurrentVariableDebt,
              ),
            }
          }),
        )
        dispatch({
          type: 'setReserveData',
          value: reserveData,
        })
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [getReserveBalance],
  )

  const mapUserReserveData = useCallback(
    ({
      reserve: {
        symbol,
        liquidityRate,
        variableBorrowRate,
        price,
        ...restReserve
      },
      currentATokenBalance,
      currentTotalDebt,
      ...rest
    }: UserReserveDataQuery) => ({
      ...rest,
      ...restReserve,
      currentATokenBalance: bigNumberToNumber(currentATokenBalance),
      currentTotalDebt: bigNumberToNumber(currentTotalDebt),
      symbol: symbol,
      icon: Assets[symbol].icon,
      fullName: Assets[symbol].fullName,
      supplyAPY: calculateAPY(liquidityRate),
      variableBorrowAPY: calculateAPY(variableBorrowRate),
      priceInEth: bigNumberToNumber(price.priceInEth),
      usdPriceEth: bigNumberToNumber(price.oracle.usdPriceEth),
    }),
    [],
  )

  useEffect(() => {
    if (data) {
      void setReserveData(data.reserves)
      const userReserveData = data.userReserves.map(mapUserReserveData)
      dispatch({
        type: 'setUserReservesData',
        value: userReserveData,
      })
    }
  }, [data, setReserveData, mapUserReserveData])

  useEffect(() => {
    if (signer && currentAccount) {
      void getUserAccountData()
    }
  }, [currentAccount, signer, getUserAccountData])

  return {
    state: { ...state, error, loading },
    dispatch,
  }
}

export const WalletContainer = createContainer<DepositContainerState, State>(
  useWallet,
)
