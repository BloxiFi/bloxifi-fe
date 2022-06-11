import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'

import { getContract } from '../../utilities'

import FEEDER_DATA from './staking.json'

type StakingContract = typeof FEEDER_DATA

function getStakedContractInfo(
  contractName: keyof StakingContract,
  type: keyof StakingContract[keyof StakingContract],
) {
  return getContract<StakingContract>(FEEDER_DATA, contractName, type)
}

export const approvedStakingToken =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935' as const

interface MockTokenContract extends ethers.Contract {
  allowance: (
    account: Web3ReactContextInterface['account'],
    abi: any,
  ) => Promise<ethers.ContractTransaction>
  approve: (
    abi: any,
    approvedToken: typeof approvedStakingToken,
  ) => Promise<ethers.ContractTransaction>
  balanceOf: (
    account: Web3ReactContextInterface['account'],
  ) => Promise<BigNumber>
  mint: (amount: BigNumber) => Promise<ethers.ContractTransaction>
}

export const Staking = {
  stakedAave: {
    //COMMENT
    getStakeContract(signer: JsonRpcSigner) {
      return new ethers.Contract(
        getStakedContractInfo('stakedAave', 'address'),
        getStakedContractInfo('stakedAave', 'abi'),
        signer,
      )
    },
  },
  mockedToken: {
    //COMMENT
    getMockTokenContract(signer: JsonRpcSigner): MockTokenContract {
      return new ethers.Contract(
        getStakedContractInfo('mockToken', 'address'),
        getStakedContractInfo('mockToken', 'abi'),
        signer,
        //N.B had to assert here because Contract is too generic and we want to add types from our contracts
      ) as MockTokenContract
    },
    //COMMENT
    async getAllowance(
      mockTokenContract: MockTokenContract,
      account: Web3ReactContextInterface['account'],
    ) {
      return await mockTokenContract.allowance(
        account,
        getStakedContractInfo('stakedAave', 'address'),
      )
    },
    //COMMENT
    async approve(mockTokenContract: MockTokenContract) {
      return await mockTokenContract.approve(
        getStakedContractInfo('stakedAave', 'address'),
        approvedStakingToken,
      )
    },
    //COMMENT
    async getTokenBalance(
      mockTokenContract: MockTokenContract,
      account: Web3ReactContextInterface['account'],
    ) {
      return await mockTokenContract.balanceOf(account)
    },
    //COMMENT
    async mintToken(
      mockTokenContract: MockTokenContract,
      amount: number | string,
    ) {
      return await mockTokenContract.mint(
        ethers.utils.parseUnits(String(amount), 18),
      )
    },
  },
}
