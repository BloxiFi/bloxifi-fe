import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'

import { getContract } from '../../utilities'

import LENDING_POOL_ABI from './borrow.json'

type LandingPoolAbi = typeof LENDING_POOL_ABI

export function getLandingPoolContractInfo(
  contractName: keyof LandingPoolAbi,
  type: keyof LandingPoolAbi[keyof LandingPoolAbi],
) {
  return getContract<LandingPoolAbi>(LENDING_POOL_ABI, contractName, type)
}

interface LendingPoolContract extends ethers.Contract {
  /**
   * @dev Deposits an `amount` of underlying asset into the reserve, receiving in return overlying aTokens.
   * - E.g. User deposits 100 USDC and gets in return 100 aUSDC
   * @param address The address of the underlying asset to deposit
   * @param amount The amount to be deposited
   * @param account The address that will receive the aTokens, same as msg.sender if the user
   *   wants to receive them on his own wallet, or a different address if the beneficiary of aTokens
   *   is a different wallet
   * @param referralCode Code used to register the integrator originating the operation, for potential rewards.
   *   0 if the action is executed directly by the user, without any middle-man
   **/
  deposit: (
    address: string,
    amount: BigNumber,
    account: Web3ReactContextInterface['account'],
    referralCode: number,
  ) => Promise<ethers.ContractTransaction>
}

export const BorrowAndLending = {
  lendingPool: {
    //COMMENT
    getLendingPoolContract(signer: JsonRpcSigner): LendingPoolContract {
      return new ethers.Contract(
        getLandingPoolContractInfo('lendingPool', 'address'),
        getLandingPoolContractInfo('lendingPool', 'abi'),
        signer,
      ) as LendingPoolContract
    },
    //COMMENT
    async deposit(
      depositContract: LendingPoolContract,
      tokenAddress: string,
      amountToDeposit: number | string,
      currentAccount: Web3ReactContextInterface['account'],
      referralCode = 0,
    ): Promise<ethers.ContractTransaction> {
      return await depositContract.deposit(
        tokenAddress,
        ethers.utils.parseEther(String(amountToDeposit)),
        currentAccount,
        referralCode,
      )
    },
  },
}
