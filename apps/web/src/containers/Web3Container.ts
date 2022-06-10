import { supportedChainIds } from '@bloxifi/core'
import { Action } from '@bloxifi/types'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useEffect, useReducer, useState } from 'react'
import { createContainer } from 'unstated-next'

export type Web3Data = {
  currentAccount: string
  isConnected: boolean
  loading: boolean
  provider: JsonRpcProvider | undefined
  chainId: number
  error: Error | undefined
  isSupportedNetwork: boolean
}

const defaultState: Web3Data = {
  currentAccount: '',
  isConnected: false,
  loading: false,
  provider: undefined,
  chainId: undefined,
  error: undefined,
  isSupportedNetwork: false,
}
type ActionType = 'setIsSupportedNetwork'

const reducer = (state: Web3Data, action: Action<ActionType>) => {
  switch (action.type) {
    case 'setIsSupportedNetwork':
      return { ...state, isSupportedNetwork: action.value }
    default:
      return defaultState
  }
}

function useContainer(initialState: Web3Data) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...initialState,
  })

  const {
    account,
    active: networkActive,
    error: networkError,
    setError: setNetworkError,
    activate: activateNetwork,
    deactivate: deactivateNetwork,
    library,
    chainId,
  } = useWeb3React()
  const [loading, setLoading] = useState(false)

  const connectWallet = async (): Promise<void> => {
    setLoading(true)
    try {
      await activateNetwork(new InjectedConnector({}), undefined, true)
      localStorage.setItem('isConnected', 'true')
    } catch (error) {
      setNetworkError(error)
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = (): void => {
    try {
      deactivateNetwork()
      localStorage.removeItem('isConnected')
    } catch (error) {
      setNetworkError(error)
    }
  }

  useEffect(() => {
    dispatch({
      type: 'setIsSupportedNetwork',
      value: supportedChainIds.includes(chainId),
    })

    if (!networkActive && localStorage.getItem('isConnected')) {
      connectWallet().catch(error => setNetworkError(error))
    }
  }, [networkActive, chainId])

  return {
    state: {
      ...state,
      isConnected: networkActive,
      currentAccount: account,
      error: networkError,
      chainId,
      provider: library,
      loading,
    },
    dispatch,
    connectWallet,
    disconnectWallet,
  }
}

export const Web3Container = createContainer(useContainer)
