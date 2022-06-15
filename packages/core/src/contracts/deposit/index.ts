import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'
import { getContract } from '../../utilities'
import FEEDER_DATA from './deposit.json'

type DepositABI = typeof FEEDER_DATA

function getDepositContractInfo(
  contractName: keyof DepositABI,
  type: keyof DepositABI[keyof DepositABI],
) {
  return getContract<DepositABI>(FEEDER_DATA, contractName, type)
}

interface LendingPoolContract extends ethers.Contract {
  deposit: (
    address: string,
    amount: BigNumber,
    account: Web3ReactContextInterface['account'],
    referralCode: number,
  ) => Promise<ethers.ContractTransaction>
}

export const Deposit = {
  lendingPool: {
    //COMMENT
    getLendingPoolContract(signer: JsonRpcSigner): LendingPoolContract {
      return new ethers.Contract(
        getDepositContractInfo('lendingPool', 'address'),
        getDepositContractInfo('lendingPool', 'abi'),
        signer,
      ) as LendingPoolContract
    },
  },
}
