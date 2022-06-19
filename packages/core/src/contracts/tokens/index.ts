import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'

import { getLandingPoolContractInfo } from '../borrow'
import { getStakedContractInfo } from '../staking'

import TOKENS from './tokens.json'
import ABI from './abi.json'

type StakingTokens = { mockToken: string }
export type TokenList = keyof (typeof TOKENS & StakingTokens)

type AbiType = 'address' | 'abi'
type AllowanceType = 'deposit' | 'staking'

const getTokenContractInfo = (token: TokenList, type: AbiType) => {
  switch (token) {
    case 'mockToken':
      return getStakedContractInfo(token, type)
    default:
      return type === 'abi' ? ABI : TOKENS[token]
  }
}

export const getContractAddress = (
  contractName: Exclude<TokenList, keyof StakingTokens>,
) => TOKENS[contractName]

export function getAllAssets() {
  return Object.entries(TOKENS) as [
    Exclude<TokenList, keyof StakingTokens>,
    string,
  ][]
}

export const APPROVED_TOKEN =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935' as const

export interface TokenContract extends ethers.Contract {
  /**
   * Allowance method for checking if use approved our contract to use the assets.
   */
  allowance: (
    account: Web3ReactContextInterface['account'],
    abi: any,
  ) => Promise<ethers.ContractTransaction>
  /**
   * Approving method for approving the contract before (staking or depositig) so that we can use their assets.
   * We need to approve only once, after that we are using allowance method to check if the user already approved.
   *
   * @param abi - CurrentAccount fetched from our Web3Provider
   * @param approvedToken - Passing {@link APPROVED_TOKEN} now this should probably be different on every market.
   */
  approve: (
    abi: any,
    approvedToken: typeof APPROVED_TOKEN,
  ) => Promise<ethers.ContractTransaction>
  /**
   * Method for checking how much balance we have for desired token.
   *
   * @param account - CurrentAccount fetched from our Web3Provider
   */
  balanceOf: (
    account: Web3ReactContextInterface['account'],
  ) => Promise<BigNumber>
  /**
   * Method for minting the token when we are on test-net
   *
   * @param amount - Pass the amount to mint as {@link BigNumber}
   */
  mint: (amount: BigNumber) => Promise<ethers.ContractTransaction>
}

export const Tokens = {
  //COMMENT
  getTokenContract(signer: JsonRpcSigner, token: TokenList): TokenContract {
    return new ethers.Contract(
      getTokenContractInfo(token, 'address'),
      getTokenContractInfo(token, 'abi'),
      signer,
      //N.B had to assert here because Contract is too generic and we want to add types from our contracts
    ) as TokenContract
  },
  /**
   * Method for checking if we have approved certain asset to be deposited or staked.
   *
   * @param tokenContract - Pass the token contract {@link TokenContract} where we'll check for allowance
   * @param account - CurrentAccount fetched from our Web3Provider
   * @param allowanceType - Type whether we are checking approval for 'staking' or 'deposit' (defaults to 'deposit')
   */
  async getAllowance(
    tokenContract: TokenContract,
    account: Web3ReactContextInterface['account'],
    allowanceType: AllowanceType,
  ): Promise<ethers.ContractTransaction> {
    return await tokenContract.allowance(
      account,
      allowanceType === 'deposit'
        ? getLandingPoolContractInfo('lendingPool', 'address')
        : getStakedContractInfo('stakedAave', 'address'),
    )
  },
  //COMMENT
  async approveToken(
    tokenContract: TokenContract,
    allowanceType: AllowanceType,
  ): Promise<ethers.ContractTransaction> {
    return await tokenContract.approve(
      allowanceType === 'deposit'
        ? getLandingPoolContractInfo('lendingPool', 'address')
        : getStakedContractInfo('stakedAave', 'address'),
      APPROVED_TOKEN,
    )
  },
  //COMMENT
  async getTokenBalance(
    tokenContract: TokenContract,
    account: Web3ReactContextInterface['account'],
  ): Promise<BigNumber> {
    return await tokenContract.balanceOf(account)
  },
  //COMMENT
  async mintToken(
    tokenContract: TokenContract,
    amount: number | string,
  ): Promise<ethers.ContractTransaction> {
    return await tokenContract.mint(ethers.utils.parseUnits(String(amount), 18))
  },
}
