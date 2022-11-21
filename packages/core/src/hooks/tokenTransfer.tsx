import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config'
import { init } from '@moonbeam-network/xcm-sdk'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { JsonRpcSigner } from '@ethersproject/providers'
import { parseUnits } from 'ethers/lib/utils'

//deposit -> from Polka to Moonriver
//withdraw -> from Moonriver to Polkadot

const withdrawToken = async (
  _amount: string,
  _polkaAcc: string,
  _metamaskSigner: JsonRpcSigner,
  _tokenSymbol: string,
  _chain: string,
) => {
  const polkaInjector = await web3FromAddress(_polkaAcc)
  const polkaSigner = polkaInjector.signer
  const { moonriver } = init({
    ethersSigner: _metamaskSigner,
    polkadotSigner: polkaSigner,
  })

  const token = AssetSymbol[_tokenSymbol.toUpperCase()]
  const chain = ChainKey[_chain]
  const { to } = moonriver.withdraw(token)
  const respcall = await to(chain).get(_polkaAcc)
  const amount = parseUnits(_amount, respcall.asset.decimals)
  return await respcall.send(amount.toBigInt(), event => {
    return event
  })
}

const depositToken = async (
  _amount: string,
  _polkaAcc: string,
  _metamaskSigner: JsonRpcSigner,
  _metamaskAcc: string,
  _tokenSymbol: string,
  _chain: string,
) => {
  const polkaInjector = await web3FromAddress(_polkaAcc)
  const polkaSigner = polkaInjector.signer
  const { moonriver } = init({
    ethersSigner: _metamaskSigner,
    polkadotSigner: polkaSigner,
  })

  const token = AssetSymbol[_tokenSymbol.toUpperCase()]
  const chain = ChainKey[_chain]
  const { from } = moonriver.deposit(token)
  const respcall = await from(chain).get(_metamaskAcc, _polkaAcc)
  const amount = parseUnits(_amount, respcall.asset.decimals)
  return await respcall.send(amount.toBigInt(), event => {
    return event
  })
}

/**
 * Function that execute Token Transfer logic
 */
export const TokenTransfer = async (
  originChain: string,
  destinationChain: string,
  tokenAmount: string,
  polkaAccount: InjectedAccountWithMeta,
  metamaskSigner: JsonRpcSigner,
  metamaskAccount: string,
  tokenSymbol: string,
) => {
  const transaction = ''
  try {
    if (originChain === 'Moonriver') {
      const transaction = await withdrawToken(
        tokenAmount,
        polkaAccount.address,
        metamaskSigner,
        tokenSymbol,
        destinationChain,
      )
    } else if (destinationChain === 'Moonriver') {
      const transaction = await depositToken(
        tokenAmount,
        polkaAccount.address,
        metamaskSigner,
        metamaskAccount,
        tokenSymbol,
        originChain,
      )
    }
  } catch (e) {
    throw new Error(e)
  }
  return transaction
}
