import { Staking, Tokens } from '@bloxifi/core'
import {
  CheckAllowanceFunction,
  FetchTokenBalanceFunction,
} from '@bloxifi/types'
import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { Grid } from '@bloxifi/ui/src/Layouts/GridLayout'
import { ethers } from 'ethers'

import { Web3Container } from '@/containers/Web3Container'

export const StakeModalContent = () => {
  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()
  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState(false)
  const [stakeCompleted, setStakeCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState()
  const [balance, setBalance] = useState<number | undefined>()

  const mintTokenValue = '5'
  const stakeTokenValue = '1'
  const stakeContract = Staking.stakedAave.getStakeContract(signer)
  const mockTokenContract = Tokens.getTokenContract(signer, 'mockToken')

  const isApproveDisabled = !isSupportedNetwork || loading || approved
  const isStakeDisabled =
    !isSupportedNetwork || loading || (shouldApproveContract && !approved)

  const getTokenBalance: FetchTokenBalanceFunction = useCallback(async () => {
    try {
      const balanceEth = await Tokens.getTokenBalance(
        mockTokenContract,
        currentAccount,
      )
      setBalance(Number(ethers.utils.formatUnits(balanceEth)))
      //probably should setHasError(undefined)
    } catch (error) {
      setHasError(error)
    }
  }, [currentAccount, mockTokenContract])

  const checkAllowance: CheckAllowanceFunction = useCallback(async () => {
    try {
      const approvedTokens = await Tokens.getAllowance(
        mockTokenContract,
        currentAccount,
        'staking',
      )
      setShouldApproveContract(approvedTokens.toString() === '0')
      setHasError(null)
    } catch (error) {
      setHasError(error)
    }
  }, [currentAccount, mockTokenContract])

  useEffect(() => {
    if (isSupportedNetwork) {
      void checkAllowance()
    }
  }, [checkAllowance, isSupportedNetwork])

  useEffect(() => {
    void getTokenBalance()
  }, [getTokenBalance])

  const resetState = () => {
    setApproved(false)
    setShouldApproveContract(false)
    setStakeCompleted(false)
    setHasError(null)
  }

  const mint = async () => {
    setLoading(true)
    try {
      const response = await Tokens.mintToken(mockTokenContract, mintTokenValue)
      await response.wait()
      setHasError(null)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const stake = async () => {
    setLoading(true)
    try {
      const response = await stakeContract.stake(
        currentAccount,
        ethers.utils.parseEther(stakeTokenValue),
      )

      const isStaked = await response.wait()
      setStakeCompleted(!!isStaked)
      setTimeout(() => resetState(), 3000)
      setHasError(null)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const approve = async () => {
    setLoading(true)
    try {
      const response = await Tokens.approveToken(mockTokenContract, 'staking')
      const isApproved = await response.wait()
      setApproved(!!isApproved)
      setHasError(null)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BoxLayout>
      <StackLayout
        gap={0.5}
        style={{ border: '1px solid', padding: 20, margin: 20, width: 300 }}
        data-cy-stake-content="true"
      >
        <h3>Stake Blox </h3>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Balance:</span>
          <span>{balance} Blox</span>
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Amount to stake: {stakeTokenValue} Blox</span>
          <button
            data-cy-blox-mint="true"
            disabled={!isSupportedNetwork}
            onClick={mint}
          >
            Get {mintTokenValue} Blox
          </button>{' '}
        </Grid>

        <p style={{ color: 'orange' }}>{loading && 'Please wait...'}</p>
        <p style={{ color: 'green' }}>
          {stakeCompleted && 'Successfully completed!'}
        </p>
        <p style={{ color: 'red' }}>{hasError && 'Something went wrong'}</p>
        {shouldApproveContract && (
          <button
            data-cy-approve-button="true"
            disabled={isApproveDisabled}
            onClick={approve}
          >
            Approve to continue
          </button>
        )}

        <button
          data-cy-stake-button="true"
          disabled={isStakeDisabled}
          onClick={stake}
        >
          Stake
        </button>
      </StackLayout>
    </BoxLayout>
  )
}
