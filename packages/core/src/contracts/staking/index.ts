import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'

import { getContract } from '../../utilities'

import FEEDER_DATA from './staking.json'

type StakingABI = typeof FEEDER_DATA

export function getStakedContractInfo(
  contractName: keyof StakingABI,
  type: keyof StakingABI[keyof StakingABI],
) {
  return getContract<StakingABI>(FEEDER_DATA, contractName, type)
}

interface StakingContract extends ethers.Contract {
  //COMMENT
  balanceOf: (
    account: Web3ReactContextInterface['account'],
  ) => Promise<BigNumber>
  //COMMENT
  COOLDOWN_SECONDS: () => Promise<BigNumber>

  getTotalRewardsBalance: /**
   * @dev Return the total rewards pending to claim by an staker
   * @param account The staker address
   * @return The rewards
   */ (account: Web3ReactContextInterface['account']) => Promise<BigNumber>

  claimRewards: /**
   * @dev Claims an `amount` of `REWARD_TOKEN` to the address `to`
   * @param account Address to stake for
   * @param amount Amount to stake
   **/ (
    account: Web3ReactContextInterface['account'],
    amount: BigNumber,
  ) => Promise<ethers.ContractTransaction>
}

export const Staking = {
  stakedAave: {
    /**
     * Function to instantiate staking contract
     * @returns {@link StakingContract}
     **/
    getStakeContract(signer: JsonRpcSigner): StakingContract {
      return new ethers.Contract(
        getStakedContractInfo('stakedAave', 'address'),
        getStakedContractInfo('stakedAave', 'abi'),
        signer,
      ) as StakingContract
    },
    /**
     * Extends {@link StakingContract.claimRewards}
     **/
    async claimRewards(
      stakingContract: StakingContract,
      account: Web3ReactContextInterface['account'],
      amount: number | string,
    ) {
      return await stakingContract.claimRewards(
        account,
        ethers.utils.parseEther(String(amount)),
      )
    },
  },
}
