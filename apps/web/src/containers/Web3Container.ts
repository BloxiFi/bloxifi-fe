import { delay, supportedChainIds } from '@bloxifi/core'
import {
  Action,
  CheckForMetamaskFunction,
  ConnectWalletFunction,
  Web3ContainerProps,
} from '@bloxifi/types'
import detectEthereumProvider from '@metamask/detect-provider'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { createContainer } from 'unstated-next'

/**
 * TRANSACTION_REFETCH_INTERVAL
 * Reperesents the number of milliseconds to wait before refetching TX data until TRANSACTION_MIN_CONFIRMATION number is reached
 */
const TRANSACTION_REFETCH_INTERVAL = 1000
/**
 * TRANSACTION_MIN_CONFIRMATION
 * Reperesents the min number of TX confirmations that ensures that values are updated on blockchain
 */
const TRANSACTION_MIN_CONFIRMATION = 2

const defaultState: Web3ContainerProps = {
  currentAccount: '',
  isConnected: false,
  loading: false,
  provider: undefined,
  chainId: undefined,
  error: undefined,
  isSupportedNetwork: false,
  isMetamaskInstalled: false,
  signer: undefined,
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
  const [signer, setSigner] = useState()

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

  const disconnectWallet = (): void => {
    try {
      deactivateNetwork()
      localStorage.removeItem('isConnected')
    } catch (error) {
      setNetworkError(error)
    }
  }

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

  useEffect(() => {
    if (library) {
      setSigner(library.getSigner())
    }
  }, [library])

  /**
   * The function that is waiting for defined amount of TX confirmations to be completed and refetching data from subgraph
   * @param txHash - The hash of transaction
   * @param refetch - The function that refetches subgraph data when tx hash reached defined number of confirmation
   */
  const waitTransactionConfirmation = async (
    txHash: string,
    refetch: () => void,
  ) => {
    let transactionReceipt = null

    while (
      transactionReceipt == null ||
      transactionReceipt.confirmations < TRANSACTION_MIN_CONFIRMATION
    ) {
      transactionReceipt = await library.getTransactionReceipt(txHash)
      refetch()

      await delay(TRANSACTION_REFETCH_INTERVAL)
    }
  }

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
      signer,
    },
    dispatch,
    connectWallet,
    disconnectWallet,
    waitTransactionConfirmation,
  }
}

export const Web3Container = createContainer(useContainer)
