import { supportedChainIds } from '@bloxifi/core'
import { Action } from '@bloxifi/types'
import { JsonRpcProvider } from '@ethersproject/providers'
import detectEthereumProvider from '@metamask/detect-provider'
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
  isMetamaskInstalled: boolean
}

const defaultState: Web3Data = {
  currentAccount: '',
  isConnected: false,
  loading: false,
  provider: undefined,
  chainId: undefined,
  error: undefined,
  isSupportedNetwork: false,
  isMetamaskInstalled: false,
}
type ActionType = 'isMetamaskInstalled'

const reducer = (state: Web3Data, action: Action<ActionType>) => {
  switch (action.type) {
    case 'isMetamaskInstalled': {
      return { ...state, isMetamaskInstalled: action.value }
    }
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
  const isSupportedNetwork = supportedChainIds.includes(chainId)

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

  async function checkForMetamask(): Promise<void> {
    try {
      const provider = await detectEthereumProvider({
        mustBeMetaMask: true,
      })
      dispatch({ type: 'isMetamaskInstalled', value: !!provider })
    } catch (error) {
      setNetworkError(error)
    }
  }

  useEffect(() => {
    void checkForMetamask()
  }, [networkActive])

  useEffect(() => {
    if (localStorage.getItem('isConnected')) {
      void connectWallet()
    }
  }, [])

  return {
    state: {
      ...state,
      isSupportedNetwork,
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
