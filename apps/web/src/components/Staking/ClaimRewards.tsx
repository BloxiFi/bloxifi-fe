import { Staking } from '@bloxifi/core'
import React, { useEffect, useState } from 'react'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { Grid } from '@bloxifi/ui/src/Layouts/GridLayout'
import { ethers } from 'ethers'

import { Web3Container } from '@/containers/Web3Container'

export const ClaimRewards = () => {
  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()
  const [claimCompleted, setClaimCompleted] = useState(false)
  const [tokenRewards, setTokenRewards] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState()

  const stakeContract = Staking.stakedAave.getStakeContract(signer)

  const isClaimDisabled =
    !isSupportedNetwork || loading || Number(tokenRewards) === 0

  const getTotalRewardsBalance = async () =>
    await stakeContract.getTotalRewardsBalance(currentAccount)

  useEffect(() => {
    isSupportedNetwork &&
      getTotalRewardsBalance()
        .then(response => {
          setTokenRewards(ethers.utils.formatUnits(response))
          setHasError(null)
        })
        .catch(error => setHasError(error))
  }, [isSupportedNetwork, currentAccount, claimCompleted])

  const resetState = () => {
    setClaimCompleted(false)
    setHasError(null)
  }

  const claim = async () => {
    setLoading(true)
    try {
      const response = await stakeContract.claimRewards(
        currentAccount,
        ethers.utils.parseEther(tokenRewards),
      )
      const isCompleted = await response.wait()
      setClaimCompleted(!!isCompleted)
      setTimeout(() => resetState(), 3000)
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
        <h3>Claim rewards</h3>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Amount: {tokenRewards} </span>{' '}
        </Grid>

        <p style={{ color: 'orange' }}>{loading && 'Please wait...'}</p>
        <p style={{ color: 'green' }}>
          {claimCompleted && 'Successfully completed!'}
        </p>
        <p style={{ color: 'red' }}>{hasError && 'Something went wrong'}</p>

        <button disabled={isClaimDisabled} onClick={claim}>
          Claim Blox
        </button>
      </StackLayout>
    </BoxLayout>
  )
}
