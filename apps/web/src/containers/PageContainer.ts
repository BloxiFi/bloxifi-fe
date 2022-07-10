import { Action } from '@bloxifi/types'
import { PageLayoutActions, PageLayoutState, usePageLayout } from '@bloxifi/ui'
import { Reducer } from 'preact/compat'
import { Dispatch, useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { t } from 'i18next'

interface State {
  title: string
}

type ActionType = 'setTitle'

interface PageContainerState {
  state: State
  dispatch: Dispatch<Action<ActionType>>
  setTitle: (title: string) => void
  pageLayout: PageLayoutState & PageLayoutActions
}

const defaultState: State = {
  title: 'BloxiFi',
}

const reducer = (state: State, action: Action<ActionType>): State => {
  switch (action.type) {
    case 'setTitle': {
      return {
        ...state,
        title: t(action.value),
      }
    }
    default: {
      return state
    }
  }
}

function usePage(initialState: State = defaultState): PageContainerState {
  const [state, dispatch] = useReducer<Reducer<State, Action<ActionType>>>(
    reducer,
    initialState,
  )

  const pageLayout = usePageLayout()

  function setTitle(title = 'BloxiFi') {
    dispatch({ type: 'setTitle', value: title })
  }

  return { state, dispatch, setTitle, pageLayout }
}

export const PageContainer = createContainer<PageContainerState, State>(usePage)
