import { getContractAddress, TokenList } from '@bloxifi/core'
import { Action } from '@bloxifi/types'
import { Dispatch, Reducer, useReducer } from 'react'
import { createContainer } from 'unstated-next'

const initialToken = 'DAImb'

interface State {
  selectedAsset: TokenList
  selectedAddress: string
}

interface DepositContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType = 'setSelectedAsset'

const defaultState: State = {
  selectedAsset: initialToken,
  selectedAddress: getContractAddress(initialToken),
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setSelectedAsset':
      return {
        ...state,
        selectedAsset: action.value.asset,
        selectedAddress: action.value.address,
      }
    default:
      return defaultState
  }
}

function useDeposit(initialState: State = defaultState): DepositContainerState {
  const [state, dispatch] = useReducer<Reducer<State, Action<ActionType>>>(
    reducer,
    initialState,
  )

  return { state, dispatch }
}

export const DepositContainer = createContainer<DepositContainerState, State>(
  useDeposit,
)
