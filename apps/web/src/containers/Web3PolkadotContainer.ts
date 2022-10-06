import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
//import { ApiPromise } from '@polkadot/api'
import {
  ScProvider,
  WellKnownChain,
} from '@polkadot/rpc-provider/substrate-connect'
import {
  Action,
  CheckForPolkadotFunction,
  ConnectWalletPolkadotFunction,
  Web3PolkadotContainerProps,
} from '@bloxifi/types'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { createContainer } from 'unstated-next'

const defaultState: Web3PolkadotContainerProps = {
  currentAccountPolkadot: '',
  isConnectedPolkadot: false,
  loadingPolkadot: false,
  chainIdPolkadot: undefined,
  errorPolkadot: undefined,
  isSupportedNetworkPolkadot: false,
  isPolkadotEnabled: false,
  signerPolkadot: undefined,
  currentAccountNamePolkadot: '',
}
type ActionType = 'isPolkadotEnabled'

const reducer = (
  state: Web3PolkadotContainerProps,
  action: Action<ActionType>,
) => {
  switch (action.type) {
    case 'isPolkadotEnabled': {
      return { ...state, isPolkadotEnabled: action.value }
    }
    default:
      return defaultState
  }
}

function useContainer(initialState: Web3PolkadotContainerProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...initialState,
  })
  //const [loading, setLoading] = useState(false)
  //const isSupportedNetwork
  //const [signer, setSigner] = useState()
  const [networkError, setNetworkError] = useState(undefined)
  const [isPolkaEnabled, setIsPolkaEnabled] = useState(false)
  //const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')

  const connectWallet: ConnectWalletPolkadotFunction = useCallback(async () => {
    //setLoading(true)
    try {
      const provider = new ScProvider(WellKnownChain.rococo_v2_2)
      await provider.connect()
      //const api = await new ApiPromise({ provider }).isReady
      //const header = await api.rpc.chain.getHeader()
      //const chain = await api.rpc.system.chain()
      localStorage.setItem('isConnectedPolkadot', 'true')
      //console.log(chain, header)
    } catch (error) {
      setNetworkError(error)
    } finally {
      //setLoading(false)
    }
  }, [setNetworkError])

  const checkForPolkadot: CheckForPolkadotFunction = useCallback(async () => {
    try {
      const extensions = await web3Enable('bloxifi')
      if (extensions.length === 0) {
        dispatch({ type: 'isPolkadotEnabled', value: false })
        setIsPolkaEnabled(false)
        //console.log('polka ne')
      } else {
        dispatch({ type: 'isPolkadotEnabled', value: true })
        setIsPolkaEnabled(true)
        //console.log('polka da')
        localStorage.setItem('isConnectedPolkadot', 'true')
        //connectWallet()
        const accounts = await web3Accounts()
        //setAccounts(accounts)
        //accounts.map(account => {
        //console.log(account.address, account.meta.name)
        //})

        setSelectedAccount(accounts[0].address)
      }
    } catch (error) {
      setNetworkError(error)
    }
  }, [])

  useEffect(() => {
    void checkForPolkadot()
  }, [checkForPolkadot])

  useEffect(() => {
    if (localStorage.getItem('isConnectedPolkadot')) {
      void connectWallet()
    }
  }, [connectWallet])

  return {
    state: {
      ...state,
      currentAccountPolkadot: selectedAccount,
      loadingPolkadot: false,
      chainIdPolkadot: undefined,
      errorPolkadot: undefined,
      isSupportedNetworkPolkadot: false,
      isPolkadotEnabled: isPolkaEnabled,
      signerPolkadot: selectedAccount,
      error: networkError,
      loading: false,
    },
    dispatch,
    connectWallet,
  }
}

export const Web3PolkadotContainer = createContainer(useContainer)
