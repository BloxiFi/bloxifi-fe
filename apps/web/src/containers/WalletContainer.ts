import { useQuery } from '@apollo/client'
import {
  GET_RESERVE_DATA,
  ReservesData,
  ReservesGraph,
  TokenContract,
  Tokens,
  UserReserveData,
  UserReserveVariables,
} from '@bloxifi/core'
import Assets from '@bloxifi/core/src/utilities/assets.json'
import { Action } from '@bloxifi/types'
import { ethers } from 'ethers'
import { Dispatch, Reducer, useEffect, useReducer, useState } from 'react'
import { createContainer } from 'unstated-next'

import { Web3Container } from './Web3Container'

export interface WalletBalance extends ReservesData {
  balance: string
  icon: string
  fullName: string
  supplyAPY: number
  variableBorrowAPY: number
}

type State = {
  reserves: WalletBalance[]
  userReserves: UserReserveData[]
  error?: Error
  loading: boolean
}
interface DepositContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType = 'setReserveData' | 'setUserReservesData'

const defaultState = {
  reserves: [],
  userReserves: [],
  error: undefined,
  loading: false,
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setReserveData': {
      return {
        ...state,
        reserves: [...state.reserves, action.value],
      }
    }
    case 'setUserReservesData': {
      return {
        ...state,
        userReserves: [...state.userReserves, action.value],
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
  const [loading, setLoading] = useState<boolean>(false)

  const { data, loading: reserveLoading } = useQuery<
    ReservesGraph,
    UserReserveVariables
  >(GET_RESERVE_DATA, {
    variables: {
      user: currentAccount?.toLowerCase(),
    },
  })

  const setReserveData = async (reserve: ReservesData) => {
    setLoading(true)
    try {
      const tokenContract: TokenContract = Tokens.getTokenContract(
        signer,
        reserve.name,
      )

      const balance = await Tokens.getTokenBalance(
        tokenContract,
        currentAccount,
      )

      dispatch({
        type: 'setReserveData',
        value: {
          ...reserve,
          balance: Number(ethers.utils.formatUnits(balance)),
          icon: Assets[reserve.symbol].icon,
          fullName: Assets[reserve.symbol].fullName,
          supplyAPY: calculateAPY(reserve.liquidityRate),
          variableBorrowAPY: calculateAPY(reserve.variableBorrowRate),
        },
      })
      setError(undefined)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const setUserReserveData = (data: UserReserveData) => {
    const { reserve, currentATokenBalance, ...rest } = data
    dispatch({
      type: 'setUserReservesData',
      value: {
        ...rest,
        ...reserve,
        currentATokenBalance: Number(
          ethers.utils.formatUnits(currentATokenBalance),
        ),
        icon: Assets[reserve.symbol].icon,
        fullName: Assets[reserve.symbol].fullName,
      },
    })
  }
  useEffect(() => {
    if (data) {
      data.reserves.map((reserve: ReservesData) => setReserveData(reserve))
      data.userReserves.map((reserve: UserReserveData) =>
        setUserReserveData(reserve),
      )
    }
  }, [data, setReserveData])

  return {
    state: { ...state, error, loading: reserveLoading || loading },
    dispatch,
  }
}

export const WalletContainer = createContainer<DepositContainerState, State>(
  useWallet,
)
