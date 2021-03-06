import { Staking } from '@bloxifi/core'
import { FetchCooldownPeriod, FetchStakedBalance } from '@bloxifi/types'
import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { Grid } from '@bloxifi/ui/src/Layouts/GridLayout'
import { ethers } from 'ethers'

import { Web3Container } from '@/containers/Web3Container'

export const UnstakeModalContent = () => {
  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [unstakeCompleted, setUnstakeCompleted] = useState(false)
  const [cooldownLoading, setCooldownLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState()
  const [stakedBalance, setStakedBalance] = useState<number>()
  const [cooldownPeriod, setCooldownPeriod] = useState<number>()

  const unstakeTokenValue = '1'
  const stakeContract = Staking.stakedAave.getStakeContract(signer)
  const isUnstakeDisabled =
    !isSupportedNetwork || loading || cooldownLoading || stakedBalance === 0

  const getStakedBalance: FetchStakedBalance = useCallback(async () => {
    try {
      const balanceEth = await stakeContract.balanceOf(currentAccount)
      setStakedBalance(Number(ethers.utils.formatUnits(balanceEth)))
    } catch (error) {
      setHasError(error)
    }
  }, [currentAccount, stakeContract])

  const getCooldownPeriod: FetchCooldownPeriod = useCallback(async () => {
    try {
      const cooldown = await stakeContract.COOLDOWN_SECONDS()
      setCooldownPeriod(Number(cooldown.toString()))
    } catch (error) {
      setHasError(error)
    }
  }, [stakeContract])

  useEffect(() => {
    //we could add all promieses here as Promise.all() and if one breaks reset the data (no need for this now, until we implement entire flow)
    if (isSupportedNetwork) {
      void getStakedBalance()
    }
  }, [getStakedBalance, isSupportedNetwork])

  useEffect(() => {
    if (isSupportedNetwork) {
      void getCooldownPeriod()
    }
  }, [getCooldownPeriod, isSupportedNetwork])

  const resetState = () => {
    setUnstakeCompleted(false)
    setHasError(null)
  }

  //Activates the cooldown period to unstake.
  //After cooldown period is finished user can redeem his tokens inside window period.(100 seconds for testing)
  //Window period will be removed for production
  const unstake = async () => {
    setLoading(true)
    try {
      const response = await stakeContract.redeem(
        currentAccount,
        ethers.utils.parseEther(unstakeTokenValue),
      )
      const isUnstaked = await response.wait()

      setUnstakeCompleted(!!isUnstaked)
      setTimeout(() => resetState(), 3000)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const cooldown = async () => {
    setLoading(true)
    try {
      const response = await stakeContract.cooldown()
      const isAwaited = await response.wait()
      setCooldownLoading(!!isAwaited)

      //Wait for cooldown period to be completed and than call redeem(unstake)
      //TODO - For production mode remove setTimeout and calculate rest time by stakeContract.stakersCooldowns method
      //Because in production mode the cooldown period will lasts 7 days, for testing is 3minutes
      setTimeout(async () => {
        await unstake()
        setCooldownLoading(false)
      }, Number(cooldownPeriod) * 1000)
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
      >
        <h3>Unstake Blox</h3>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Balance:</span>
          <span>{stakedBalance} stkBlox</span>
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Amount: {unstakeTokenValue} stkBlox</span>
        </Grid>
        <p style={{ color: 'orange' }}>{loading && 'Please wait...'}</p>

        <p style={{ color: 'orange' }}>
          {cooldownLoading &&
            `Please wait cooldown period to be completed in ${Math.floor(
              cooldownPeriod / 60,
            )} minutes`}
        </p>
        <p style={{ color: 'green' }}>
          {unstakeCompleted && 'Successfully completed!'}
        </p>
        <p style={{ color: 'red' }}>{hasError && 'Something went wrong'}</p>
        <button disabled={isUnstakeDisabled} onClick={cooldown}>
          Confirm unstake
        </button>
      </StackLayout>
    </BoxLayout>
  )
}
