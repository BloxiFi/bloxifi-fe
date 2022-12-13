import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { BigNumber, ethers } from 'ethers'

import { getContract } from '../../utilities'

import LENDING_POOL_ABI from './borrow.json'

type LandingPoolAbi = typeof LENDING_POOL_ABI

//Type of interest rate mode to use. Uint 2 representing variable rate and uint 1 representing stable rate
type RateMode = 1 | 2

interface FetchUserAccountData {
  totalDebtETH: BigNumber
  availableBorrowsETH: BigNumber
  healthFactor: BigNumber
  currentLiquidationThreshold: BigNumber
  totalCollateralETH: BigNumber
}

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
  /**
   * Transfers a specific amount of the asset to the user reserve.
   * @param address The address of the underlying asset to borrow
   * @param amount The amount to borrow
   * @param interestRateMode Type of interest rate mode to use. Uint 2 representing variable rate and uint 1 representing stable rate
   * @param referralCode Code used to register the integrator originating the operation, for potential rewards.
   *   0 if the action is executed directly by the user, without any middle-man
   * @param account The user account address
   **/
  borrow: (
    address: string,
    amount: BigNumber,
    interestRateMode: RateMode,
    referralCode: number,
    account: Web3ReactContextInterface['account'],
  ) => Promise<ethers.ContractTransaction>
  /**
   * Withdraws amount of the underlying asset, i.e. redeems the underlying token and burns the aTokens.
   * @param address The address of the underlying asset to withdraw
   * @param amount The amount to withdraw
   * @param account The user account address
   **/
  withdraw: (
    address: string,
    amount: BigNumber,
    account: Web3ReactContextInterface['account'],
  ) => Promise<ethers.ContractTransaction>
  /**
   * @param address The address of the underlying asset to repay
   * @param amount The amount to repay
   * @param interestRateMode Type of interest rate mode to use. Uint 2 representing variable rate and uint 1 representing stable rate
   * @param account The user account address
   */
  repay: (
    tokenAddress: string,
    amount: BigNumber,
    rateMode: RateMode,
    account: Web3ReactContextInterface['account'],
  ) => Promise<ethers.ContractTransaction>
  /**
   * Function that we use to fetch healthFactor and data to calculate borrowed progress bar
   * Returns information of a reserve exclusively related with a particular user address
   * @param account The user account address
   **/
  getUserAccountData: (
    account: Web3ReactContextInterface['account'],
  ) => Promise<FetchUserAccountData>
  /**
   * Enable the user's specific deposit to be used as collateral.
   * @param address The address of the underlying asset
   * @param useAsCollateral If true, the asset is allowed as a collateral for borrow
   **/
  setUserUseReserveAsCollateral: (
    address: string,
    useAsCollateral: boolean,
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
      amountToDeposit: BigNumber,
      currentAccount: Web3ReactContextInterface['account'],
      referralCode = 0,
    ): Promise<ethers.ContractTransaction> {
      return await depositContract.deposit(
        tokenAddress,
        amountToDeposit,
        currentAccount,
        referralCode,
      )
    },
    async borrow(
      lendingPoolContract: LendingPoolContract,
      tokenAddress: string,
      amountToBorrow: BigNumber,
      account: Web3ReactContextInterface['account'],
      referralCode = 0,
      interestRateMode: RateMode = 2,
    ): Promise<ethers.ContractTransaction> {
      return await lendingPoolContract.borrow(
        tokenAddress,
        amountToBorrow,
        interestRateMode,
        referralCode,
        account,
      )
    },
    async withdraw(
      lendingPoolContract: LendingPoolContract,
      tokenAddress: string,
      amountToWithdraw: BigNumber,
      account: Web3ReactContextInterface['account'],
    ): Promise<ethers.ContractTransaction> {
      return await lendingPoolContract.withdraw(
        tokenAddress,
        amountToWithdraw,
        account,
      )
    },
    async repay(
      lendingPoolContract: LendingPoolContract,
      tokenAddress: string,
      amountToRepay: BigNumber,
      account: Web3ReactContextInterface['account'],
      rateMode: RateMode = 2,
    ): Promise<ethers.ContractTransaction> {
      return await lendingPoolContract.repay(
        tokenAddress,
        amountToRepay,
        rateMode,
        account,
      )
    },
    async getUserAccountData(
      contract: LendingPoolContract,
      account: Web3ReactContextInterface['account'],
    ) {
      return await contract.getUserAccountData(account)
    },
    async setUserUseReserveAsCollateral(
      contract: LendingPoolContract,
      address: string,
      useAsCollateral: boolean,
    ) {
      return await contract.setUserUseReserveAsCollateral(
        address,
        useAsCollateral,
      )
    },
  },
}
