import { Tokens } from '@bloxifi/core'
import TOKENS from '@bloxifi/core/src/contracts/tokens/tokens.json'
import { Action } from '@bloxifi/types'
import { Reducer } from 'preact/compat'
import { Dispatch, useReducer } from 'react'
import { createContainer } from 'unstated-next'

const initailToken = 'DAI'
interface State {
  selectedAsset: keyof Tokens
  selectedAddress: string
}
interface DepositContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
}

type ActionType = 'setSelectedAsset'

const defaultState: State = {
  selectedAsset: initailToken,
  selectedAddress: TOKENS[initailToken],
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
