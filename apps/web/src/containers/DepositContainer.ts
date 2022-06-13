import { Action } from '@bloxifi/types'
import { Reducer } from 'preact/compat'
import { Dispatch, useReducer } from 'react'
import { createContainer } from 'unstated-next'

interface State {
  selectedAsset: string
}

interface DepositContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType = 'setSelectedAsset'

const defaultState: State = {
  selectedAsset: 'WETH',
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setSelectedAsset':
      return { ...state, selectedAsset: action.value }
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
