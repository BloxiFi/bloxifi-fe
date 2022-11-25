import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config'
import { init, toDecimal } from '@moonbeam-network/xcm-sdk'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { JsonRpcSigner } from '@ethersproject/providers'

/**
 * Function that execute Token Transfer logic
 */
export const DotWalletBalance = async (
  originChain: string,
  polkaAccount: InjectedAccountWithMeta,
  metamaskSigner: JsonRpcSigner,
  metamaskAccount: string,
  tokenSymbol: string,
) => {
  const polkaInjector = await web3FromAddress(polkaAccount.address)
  const polkaSigner = polkaInjector.signer
  const { moonriver } = init({
    ethersSigner: metamaskSigner,
    polkadotSigner: polkaSigner,
  })
  const token = AssetSymbol[tokenSymbol.toUpperCase()]
  const chain = ChainKey[originChain]
  const { from } = moonriver.deposit(token)
  const respcall = await from(chain).get(metamaskAccount, polkaAccount.address)
  //console.log(respcall)
  const balance = toDecimal(
    respcall.moonChainFee.balance,
    respcall.moonChainFee.decimals,
  )
  return balance
}
