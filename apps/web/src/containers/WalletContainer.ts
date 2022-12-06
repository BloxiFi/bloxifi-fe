import { useQuery } from '@apollo/client'
import {
  bigNumberToNumber,
  bigNumberToString,
  BorrowAndLending,
  convertBalancesInUsdArray,
  GET_RESERVE_DATA,
  getDepositedAssetsUSD,
  ReservesDataQuery,
  ReservesGraph,
  sumArrayItems,
  TokenContract,
  Tokens,
  UserReserveDataQuery,
  UserReserveVariables,
  getAssetDetails,
} from '@bloxifi/core'
import { Action } from '@bloxifi/types'
import { BigNumber } from 'ethers'
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
  name: string
  fullName: string
  symbol: string
  icon: string
  decimals: number
  balance: string
  aTokenBalance: BigNumber
  supplyAPY: number
  liquidityRate: number
  variableBorrowAPY: number
  underlyingAsset: string
  priceInEth: number
  usdPriceEth: number
  reserveLiquidationThreshold: number
}
export type ReservesData = DefaultReserveData & {
  totalATokenSupply: string
  totalCurrentVariableDebt: string
}

export type UserReserveData = DefaultReserveData & {
  currentATokenBalance: string
  currentVariableDebt: string
  currentTotalDebt: string
  usageAsCollateralEnabledOnUser: boolean
  baseLTVasCollateral: number
}

export type UserAccountData = {
  totalDebtETH: BigNumber
  availableBorrowsETH: BigNumber
  healthFactor: number
  liquidationThreshold: number
  totalCollateralETH: BigNumber
}

interface State {
  reserves: ReservesData[]
  userReserves: UserReserveData[]
  userAccountData: UserAccountData
  availableToBorrowUSD: number
  error?: Error
  loading: boolean
}

interface DepositContainerState {
  state: State
  refetch: () => void
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType =
  | 'setReserveData'
  | 'setUserReservesData'
  | 'setUserAccountData'
  | 'setAvailableToBorrow'

const defaultState = {
  reserves: [],
  userReserves: [],
  userAccountData: {} as UserAccountData,
  availableToBorrowUSD: undefined,
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
    case 'setAvailableToBorrow': {
      return {
        ...state,
        availableToBorrowUSD: action.value,
      }
    }
    default:
      return defaultState
  }
}

const POOL_INTERVAL = 600000
// Deposit and Borrow APY calculation
export const calculateAPY = (liquidityRate: number, inPercents = true) => {
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

  const {
    data,
    refetch,
    loading: isQueryLoading,
  } = useQuery<ReservesGraph, UserReserveVariables>(GET_RESERVE_DATA, {
    variables: {
      user: currentAccount?.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POOL_INTERVAL,
  })

  const calculateAvailableBorrowsUSD = userReserves => {
    //total user deposit amount denominated in USD
    const depositAssetsUSD = userReserves.map(
      ({
        currentATokenBalance,
        priceInEth,
        usdPriceEth,
        usageAsCollateralEnabledOnUser,
        baseLTVasCollateral,
      }) => {
        return getDepositedAssetsUSD({
          currentATokenBalance,
          priceInEth,
          usdPriceEth,
          usageAsCollateralEnabledOnUser,
          baseLTVasCollateral,
        })
      },
    )

    //total user borrowed amount denominated in USD
    const totalBorrowUSD = sumArrayItems(
      convertBalancesInUsdArray(userReserves, 'currentTotalDebt'),
    )
    const totalDepositAssetUSD = sumArrayItems(depositAssetsUSD)
    return totalDepositAssetUSD - totalBorrowUSD
  }

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
          availableBorrowsETH: response.availableBorrowsETH,
          totalDebtETH: response.totalDebtETH,
          liquidationThreshold:
            Number(response.currentLiquidationThreshold.toString()) *
            Math.pow(10, -4),
          totalCollateralETH: response.totalCollateralETH,
        },
      })
    } catch (error) {
      setError(error)
    }
  }, [currentAccount, signer])

  const getReserveBalance = useCallback(
    async (address: string, aTokenAddress: string) => {
      try {
        const tokenContract: TokenContract = Tokens.getERC20TokenContract(
          signer,
          address,
        )

        const balance = await Tokens.getTokenBalance(
          tokenContract,
          currentAccount,
        )
        const aTokenBalance = await Tokens.getTokenBalance(
          tokenContract,
          aTokenAddress,
        )
        setError(undefined)
        return { balance, aTokenBalance }
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
            const { balance, aTokenBalance } = await getReserveBalance(
              reserve.underlyingAsset,
              reserve.aToken.id,
            )
            const assetDetails = getAssetDetails(reserve.symbol)
            return {
              ...reserve,
              balance: bigNumberToString(balance),
              aTokenBalance,
              icon: assetDetails.icon,
              fullName: assetDetails.fullName,
              supplyAPY: calculateAPY(reserve.liquidityRate),
              variableBorrowAPY: calculateAPY(reserve.variableBorrowRate),
              priceInEth: bigNumberToNumber(reserve.price.priceInEth),
              usdPriceEth: bigNumberToNumber(reserve.price.oracle.usdPriceEth),
              totalATokenSupply: bigNumberToString(reserve.totalATokenSupply),
              totalCurrentVariableDebt: bigNumberToString(
                reserve.totalCurrentVariableDebt,
              ),
              reserveLiquidationThreshold:
                reserve.reserveLiquidationThreshold * Math.pow(10, -4),
            }
          }),
        )
        dispatch({
          type: 'setReserveData',
          value: reserveData,
        })
      } catch (error) {
        setError(error)
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
        baseLTVasCollateral,
        reserveLiquidationThreshold,
        ...restReserve
      },
      currentATokenBalance,
      currentTotalDebt,
      ...rest
    }: UserReserveDataQuery) => {
      const assetDetails = getAssetDetails(symbol)
      return {
        ...rest,
        ...restReserve,
        currentATokenBalance: bigNumberToString(currentATokenBalance),
        currentTotalDebt: bigNumberToString(currentTotalDebt),
        symbol: symbol,
        icon: assetDetails.icon,
        fullName: assetDetails.fullName,
        supplyAPY: calculateAPY(liquidityRate),
        variableBorrowAPY: calculateAPY(variableBorrowRate),
        priceInEth: bigNumberToNumber(price.priceInEth),
        usdPriceEth: bigNumberToNumber(price.oracle.usdPriceEth),
        baseLTVasCollateral: baseLTVasCollateral * Math.pow(10, -4),
        reserveLiquidationThreshold:
          reserveLiquidationThreshold * Math.pow(10, -4),
      }
    },
    [],
  )

  const setQueryData = useCallback(
    async data => {
      setLoading(true)
      try {
        await getUserAccountData()
        await setReserveData(data.reserves)
        const userReserveData = data.userReserves.map(mapUserReserveData)
        if (userReserveData) {
          const availableToBorrowUSD =
            calculateAvailableBorrowsUSD(userReserveData)
          dispatch({
            type: 'setAvailableToBorrow',
            value: availableToBorrowUSD > 0 ? availableToBorrowUSD : 0,
          })
        }

        dispatch({
          type: 'setUserReservesData',
          value: userReserveData,
        })
        setLoading(false)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [getUserAccountData, mapUserReserveData, setReserveData],
  )

  useEffect(() => {
    if (data) {
      void setQueryData(data)
    }
  }, [data, setReserveData, mapUserReserveData, setQueryData])

  const refetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await refetch()
      await setQueryData(res.data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [refetch, setQueryData])

  return {
    state: { ...state, error, loading: loading || isQueryLoading },
    dispatch,
    refetch: refetchData,
  }
}

export const WalletContainer = createContainer<DepositContainerState, State>(
  useWallet,
)
