import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { Grid } from '@bloxifi/ui/src/Layouts/GridLayout'
import { ethers } from 'ethers'

import { contracts } from '../../utils/contracts'

export const Stake = () => {
  const web3Context = useWeb3React()
  const [signer, setSigner] = useState()
  const [approved, setApproved] = useState()
  const [stakeCompleted, setStakeCompleted] = useState()
  const [loading, setLoading] = useState(false)

  const mintTokenValue = '5'
  const stakeTokenValue = '1'

  useEffect(() => {
    if (web3Context.active) {
      const signer = web3Context.library.getSigner()
      setSigner(signer)
    }
  }, [web3Context.active])

  const stakeContract = new ethers.Contract(
    contracts.stakedAave.address,
    contracts.stakedAave.abi,
    signer,
  )

  const resetState = () => {
    setApproved(null)
    setStakeCompleted(null)
  }

  const mint = async () => {
    setLoading(true)
    try {
      const mintAssetContract = new ethers.Contract(
        contracts.mockToken.address,
        contracts.mockToken.abi,
        signer,
      )
      const response = await mintAssetContract.mint(
        ethers.utils.parseUnits(mintTokenValue, 18),
      )
      await response.wait()
    } catch (error) {
      web3Context.setError(error)
    } finally {
      setLoading(false)
    }
  }

  const stake = async () => {
    setLoading(true)
    try {
      const response = await stakeContract.stake(
        web3Context.account,
        ethers.utils.parseEther(stakeTokenValue),
      )

      const isStaked = await response.wait()
      setStakeCompleted(isStaked)
      setTimeout(() => resetState(), 3000)
    } catch (error) {
      web3Context.setError(error)
    } finally {
      setLoading(false)
    }
  }

  const approve = async () => {
    setLoading(true)
    try {
      const response = await stakeContract.approve(
        web3Context.account,
        ethers.utils.parseUnits(stakeTokenValue, 18),
      )

      const isApproved = await response.wait()
      setApproved(isApproved)
    } catch (error) {
      web3Context.setError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BoxLayout>
      {web3Context.active && (
        <StackLayout
          gap={0.5}
          style={{ border: '1px solid', padding: 20, margin: 20, width: 300 }}
        >
          <h3>Stake Blox</h3>
          <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Amount: {stakeTokenValue} Blox</span>{' '}
            <button onClick={mint}>Get {mintTokenValue} Blox</button>{' '}
          </Grid>

          <p style={{ color: 'orange' }}>{loading && 'Please wait...'}</p>
          <p style={{ color: 'green' }}>
            {stakeCompleted && 'Successfully completed!'}
          </p>
          <p style={{ color: 'red' }}>
            {web3Context.error && 'Something went wrong'}
          </p>
          <button disabled={loading || approved} onClick={approve}>
            Approve to continue
          </button>

          <button disabled={loading || !approved} onClick={stake}>
            Stake
          </button>
        </StackLayout>
      )}
    </BoxLayout>
  )
}
