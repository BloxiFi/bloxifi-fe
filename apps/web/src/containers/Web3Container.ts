import { supportedChainIds } from '@bloxifi/core'
import {
  Action,
  CheckForMetamaskFunction,
  ConnectWalletFunction,
  Web3ContainerProps,
} from '@bloxifi/types'
import detectEthereumProvider from '@metamask/detect-provider'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { createContainer } from 'unstated-next'

const defaultState: Web3ContainerProps = {
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

const reducer = (state: Web3ContainerProps, action: Action<ActionType>) => {
  switch (action.type) {
    case 'isMetamaskInstalled': {
      return { ...state, isMetamaskInstalled: action.value }
    }
    default:
      return defaultState
  }
}

function useContainer(initialState: Web3ContainerProps) {
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

  const connectWallet: ConnectWalletFunction = useCallback(async () => {
    setLoading(true)
    try {
      await activateNetwork(new InjectedConnector({}), undefined, true)
      localStorage.setItem('isConnected', 'true')
    } catch (error) {
      setNetworkError(error)
    } finally {
      setLoading(false)
    }
  }, [activateNetwork, setNetworkError])

  const disconnectWallet = useCallback(() => {
    try {
      deactivateNetwork()
      localStorage.removeItem('isConnected')
    } catch (error) {
      setNetworkError(error)
    }
  }, [deactivateNetwork, setNetworkError])

  const checkForMetamask: CheckForMetamaskFunction = useCallback(async () => {
    try {
      const provider = await detectEthereumProvider({
        mustBeMetaMask: true,
      })
      dispatch({ type: 'isMetamaskInstalled', value: !!provider })
    } catch (error) {
      setNetworkError(error)
    }
  }, [setNetworkError])

  useEffect(() => {
    void checkForMetamask()
  }, [checkForMetamask, networkActive])

  useEffect(() => {
    if (localStorage.getItem('isConnected')) {
      void connectWallet()
    }
  }, [connectWallet])

  const stateNew = useMemo(
    () => ({
      isSupportedNetwork,
      isConnected: networkActive,
      currentAccount: account,
      error: networkError,
      chainId,
      provider: library,
      loading,
    }),
    [
      account,
      chainId,
      isSupportedNetwork,
      library,
      loading,
      networkActive,
      networkError,
    ],
  )

  return {
    state: {
      ...state,
      ...stateNew,
    },
    connectWallet,
    disconnectWallet,
  }
}

export const Web3Container = createContainer(useContainer)
