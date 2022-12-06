import { useQuery } from '@apollo/client'
import {
  bigNumberToNumber,
  GET_DASHBOARD_RESERVE_DATA,
  DashboardReservesGraph,
  DashboardReservesDataQuery,
  getAssetDetails,
} from '@bloxifi/core'
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

import { calculateAPY } from './WalletContainer'

export type DashboardReservesData = {
  id: string
  name: string
  fullName: string
  symbol: string
  icon: string
  decimals: number
  supplyAPY: number
  liquidityRate: number
  variableBorrowAPY: number
  underlyingAsset: string
  priceInEth: number
  usdPriceEth: number
  totalATokenSupply: number
  totalCurrentVariableDebt: number
}

interface State {
  reserves: DashboardReservesData[]
  loading: boolean
  error: Error
}

interface DashboardContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType = 'setReserveData'

const defaultState = {
  reserves: [],
  loading: false,
  error: undefined,
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setReserveData': {
      return {
        ...state,
        reserves: action.value,
      }
    }
    default:
      return defaultState
  }
}

const POOL_INTERVAL = 600000

function useDashboard(
  initialState: State = defaultState,
): DashboardContainerState {
  const [state, dispatch] = useReducer<Reducer<State, Action<ActionType>>>(
    reducer,
    initialState,
  )

  const [error, setError] = useState<Error | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  const { data } = useQuery<DashboardReservesGraph>(
    GET_DASHBOARD_RESERVE_DATA,
    {
      fetchPolicy: 'cache-and-network',
      pollInterval: POOL_INTERVAL,
    },
  )

  const setReserveData = useCallback(
    (reserves: DashboardReservesDataQuery[]) => {
      try {
        const reserveData = reserves.map(
          (reserve: DashboardReservesDataQuery) => {
            const assetDetails = getAssetDetails(reserve.symbol)
            return {
              ...reserve,
              icon: assetDetails.icon,
              fullName: assetDetails.fullName,
              supplyAPY: calculateAPY(reserve.liquidityRate),
              variableBorrowAPY: calculateAPY(reserve.variableBorrowRate),
              priceInEth: bigNumberToNumber(reserve.price.priceInEth),
              usdPriceEth: bigNumberToNumber(reserve.price.oracle.usdPriceEth),
              totalATokenSupply: bigNumberToNumber(reserve.totalATokenSupply),
              totalCurrentVariableDebt: bigNumberToNumber(
                reserve.totalCurrentVariableDebt,
              ),
            }
          },
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
    [],
  )

  useEffect(() => {
    if (data) {
      void setReserveData(data.reserves)
    }
  }, [data, setReserveData])

  return {
    state: { ...state, loading, error },
    dispatch,
  }
}

export const DashboardContainer = createContainer<
  DashboardContainerState,
  State
>(useDashboard)
