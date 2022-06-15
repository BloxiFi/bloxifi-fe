import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'

import { getContract } from '../../utilities'
import DEPOSIT_CONTRACTS from '../deposit/deposit.json'
import STAKING_CONTRACTS from '../staking/staking.json'

import FEEDER_DATA from './tokens.json'
import ABI from './abi.json'

export type TokenList = typeof FEEDER_DATA

type ApprovalContract = 'deposit'

const getApprovalContract = (approvalContract: ApprovalContract) => {
  switch (approvalContract) {
    case 'deposit':
      return getContract(DEPOSIT_CONTRACTS, 'lendingPool', 'address')
  }
}

const getContractAddress = (contractName: keyof TokenList) =>
  FEEDER_DATA[contractName]

export const approveTokenAmount =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935' as const

export interface TokenContract extends ethers.Contract {
  allowance: (
    account: Web3ReactContextInterface['account'],
    address: string,
  ) => Promise<ethers.ContractTransaction>

  approve: (
    address: string,
    approvedToken: typeof approveTokenAmount,
  ) => Promise<ethers.ContractTransaction>

  balanceOf: (
    account: Web3ReactContextInterface['account'],
  ) => Promise<BigNumber>

  mint: (amount: BigNumber) => Promise<ethers.ContractTransaction>
}

export const Tokens = {
  //COMMENT
  getTokenContract(
    signer: JsonRpcSigner,
    token: keyof TokenList,
  ): TokenContract {
    return new ethers.Contract(
      getContractAddress(token),
      ABI,
      signer,
      //N.B had to assert here because Contract is too generic and we want to add types from our contracts
    ) as TokenContract
  },
  //COMMENT
  async getAllowance(
    tokenContract: TokenContract,
    account: Web3ReactContextInterface['account'],
    approvalContract: ApprovalContract,
  ) {
    return await tokenContract.allowance(
      account,
      getApprovalContract(approvalContract),
    )
  },
  //COMMENT
  async approveToken(
    tokenContract: TokenContract,
    approvalContract: ApprovalContract,
  ) {
    return await tokenContract.approve(
      getApprovalContract(approvalContract),
      approveTokenAmount,
    )
  },
  //COMMENT
  async getTokenBalance(
    tokenContract: TokenContract,
    account: Web3ReactContextInterface['account'],
  ) {
    return await tokenContract.balanceOf(account)
  },
  //COMMENT
  async mintToken(tokenContract: TokenContract, amount: number | string) {
    return await tokenContract.mint(ethers.utils.parseUnits(String(amount), 18))
  },
}
