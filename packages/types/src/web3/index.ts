import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

/**
 * Async function that will autologin the user if the user was previously connected (localStorage)
 */
export type ConnectWalletFunction = () => Promise<void>

/**
 * Async function that will detect if user has metamask installed and update the state
 */
export type CheckForMetamaskFunction = () => Promise<void>

//TODO type
export type Web3ContainerProps = {
  currentAccount: string
  isConnected: boolean
  loading: boolean
  provider: JsonRpcProvider | undefined
  chainId: number
  error: Error | undefined
  isSupportedNetwork: boolean
  isMetamaskInstalled: boolean
  signer: JsonRpcSigner | undefined
}
