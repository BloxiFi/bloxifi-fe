import { setApiKeyHeader } from '@bloxifi/core'
import { Action } from '@bloxifi/types'
import detectEthereumProvider from '@metamask/detect-provider'
import { useEffect, useReducer } from 'react'
import { createContainer } from 'unstated-next'

const isMetamaskInstalled = async () =>
  await detectEthereumProvider({ mustBeMetaMask: true })

const defaultState = {
  userData: null,
  isMetamaskInstalled: false,
}

type ActionType = 'setUserData' | 'updateUserData' | 'isMetamaskInstalled'

const reducer = (state, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setUserData': {
      return { ...state, userData: action.value }
    }
    case 'updateUserData': {
      return { ...state, userData: { ...state.userData, ...action.value } }
    }
    case 'isMetamaskInstalled': {
      return { ...state, isMetamaskInstalled: action.value }
    }
    default:
      return defaultState
  }
}

function useContainer(initialState) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...initialState,
  })
  const isAuthenticated = !!state.setUserData

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token')
      setApiKeyHeader(token)
    }
    isMetamaskInstalled()
      .then(res =>
        dispatch({
          type: 'isMetamaskInstalled',
          value: !!res,
        }),
      )
      .catch(e => {
        throw new Error(e)
      })
  }, [isAuthenticated])

  function authenticate(data) {
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
    }

    if (data.refresh_token) {
      localStorage.setItem('refreshToken', data.refresh_token)
    }

    setApiKeyHeader(data.access_token || data.refresh_token)

    dispatch({
      type: 'updateUserData',
      value: { username: data.user_name, ...data },
    })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setApiKeyHeader(null)
    dispatch({ type: 'setUserData', value: null })
  }

  return {
    state: { ...state, isAuthenticated },
    dispatch,
    authenticate,
    logout,
  }
}

export const UserContainer = createContainer(useContainer)
