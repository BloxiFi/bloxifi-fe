import { Staking } from '@bloxifi/core'
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { Grid } from '@bloxifi/ui/src/Layouts/GridLayout'
import { ethers } from 'ethers'

export const StakeModalContent = () => {
  const web3Context = useWeb3React<Web3Provider>()
  const signer = web3Context.library.getSigner()

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState(false)
  const [stakeCompleted, setStakeCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState()

  const mintTokenValue = '5'
  const stakeTokenValue = '1'
  const stakeContract = Staking.stakedAave.getStakeContract(signer)
  const mockTokenContract = Staking.mockedToken.getMockTokenContract(signer)

  const checkAllowance = async () =>
    await Staking.mockedToken.getAllowance(
      mockTokenContract,
      web3Context.account,
    )

  useEffect(() => {
    checkAllowance()
      .then(approvedTokens => {
        setShouldApproveContract(approvedTokens.toString() === '0')
        setHasError(null)
      })
      .catch(error => setHasError(error))
  }, [])

  const resetState = () => {
    setApproved(false)
    setShouldApproveContract(false)
    setStakeCompleted(false)
    setHasError(null)
  }

  const mint = async () => {
    setLoading(true)
    try {
      const response = await mockTokenContract.mint(
        ethers.utils.parseUnits(mintTokenValue, 18),
      )
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
        web3Context.account,
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
      const response = await Staking.mockedToken.approve(mockTokenContract)
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
          <p style={{ color: 'red' }}>{hasError && 'Something went wrong'}</p>
          {shouldApproveContract && (
            <button disabled={loading || approved} onClick={approve}>
              Approve to continue
            </button>
          )}

          <button
            disabled={loading || (shouldApproveContract && !approved)}
            onClick={stake}
          >
            Stake
          </button>
        </StackLayout>
      )}
    </BoxLayout>
  )
}
