import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { SupportedNetwork } from 'packages/core/src'

/**
 * Async function that will autologin the user if the user was previously connected (localStorage)
 */
export type ConnectWalletFunction = () => Promise<void>

/**
 * Async function that will autologin the user if the user was previously connected to Polkadot (localStorage)
 */
export type ConnectWalletPolkadotFunction = () => Promise<void>

/**
 * Async function that will detect if user has metamask installed and update the state
 */
export type CheckForMetamaskFunction = () => Promise<void>

/**
 * Async function that will detect if user has polkadot extension enabled and update the state
 */
export type CheckForPolkadotFunction = () => Promise<void>

//TODO type
export type Web3ContainerProps = {
  currentAccount: string
  isConnected: boolean
  loading: boolean
  provider: JsonRpcProvider | undefined
  chainId: number
  error: Error | undefined
  isSupportedNetwork: boolean
  network: SupportedNetwork
  isMetamaskInstalled: boolean
  signer: JsonRpcSigner | undefined
}

export type PolkadotAccount = {
  address: string
  name: string
}

//PolkaDOT type
export type Web3PolkadotContainerProps = {
  currentAccountPolkadot: string
  isConnectedPolkadot: boolean
  loadingPolkadot: boolean
  errorPolkadot: Error | undefined
  isPolkadotEnabled: boolean
  signerPolkadot: JsonRpcSigner | undefined
  isSupportedNetworkPolkadot: boolean
  chainIdPolkadot: number
  currentAccountNamePolkadot: string
  accounts: PolkadotAccount[]
}
