import {
  web3Accounts,
  //web3Accounts,
  web3Enable,
  //web3FromSource,
} from '@polkadot/extension-dapp'
//import { ApiPromise } from '@polkadot/api'
import {
  PolkadotAccount,
  Action,
  CheckForPolkadotFunction,
  ConnectWalletPolkadotFunction,
  Web3PolkadotContainerProps,
} from '@bloxifi/types'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { createContainer } from 'unstated-next'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import {
  ScProvider,
  WellKnownChain,
} from '@polkadot/rpc-provider/substrate-connect'

const defaultState: Web3PolkadotContainerProps = {
  currentAccountPolkadot: undefined,
  isConnectedPolkadot: false,
  loadingPolkadot: false,
  chainIdPolkadot: undefined,
  errorPolkadot: undefined,
  isSupportedNetworkPolkadot: false,
  isPolkadotEnabled: false,
  signerPolkadot: undefined,
  currentAccountNamePolkadot: '',
  accounts: [],
}
type ActionType = 'isPolkadotEnabled' | 'setCurrentAccount'

const reducer = (
  state: Web3PolkadotContainerProps,
  action: Action<ActionType>,
) => {
  switch (action.type) {
    case 'isPolkadotEnabled': {
      return { ...state, isPolkadotEnabled: action.value }
    }
    case 'setCurrentAccount': {
      return { ...state, currentAccountPolkadot: action.value }
    }
    default:
      return defaultState
  }
}

const hasTokenTransfer = process.env.FEATURE_TOKEN_TRANSFER

function useContainer(initialState: Web3PolkadotContainerProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...initialState,
  })
  //const [loading, setLoading] = useState(false)
  //const isSupportedNetwork
  ///const [signer, setSigner] = useState()
  const [networkError, setNetworkError] = useState(undefined)
  const [isPolkaEnabled, setIsPolkaEnabled] = useState(false)
  const [accounts, setAccounts] = useState([])

  const formatAccounts = (
    accounts: InjectedAccountWithMeta[],
  ): PolkadotAccount[] =>
    accounts.map(account => ({
      address: account.address,
      name: account.meta.name,
      source: account.meta.source,
    }))

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
    if (!hasTokenTransfer) {
      return
    }
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

        const accounts: InjectedAccountWithMeta[] = await web3Accounts()
        const formattedAccounts = formatAccounts(accounts)
        setAccounts(formattedAccounts)
        dispatch({
          type: 'setCurrentAccount',
          value: formattedAccounts[0],
        })
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
      loadingPolkadot: false,
      chainIdPolkadot: undefined,
      errorPolkadot: undefined,
      isSupportedNetworkPolkadot: true,
      isPolkadotEnabled: isPolkaEnabled,
      signerPolkadot: state.currentAccountPolkadot,
      error: networkError,
      loading: false,
      accounts,
    },
    dispatch,
    connectWallet,
  }
}

export const Web3PolkadotContainer = createContainer(useContainer)
