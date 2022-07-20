import { BorrowAndLending, Tokens } from '@bloxifi/core'
import {
  CheckAllowanceFunction,
  FetchTokenBalanceFunction,
} from '@bloxifi/types'
import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import { Grid } from '@bloxifi/ui/src/Layouts/GridLayout'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'

import { Web3Container } from '@/containers/Web3Container'
import { DepositContainer } from '@/containers/DepositContainer'

export const DepositModalContent = () => {
  const { t } = useTranslation()
  const {
    state: { selectedAsset, selectedAddress },
  } = DepositContainer.useContainer()
  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState()
  const [loading, setLoading] = useState(false)

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [depositCompleted, setDepositCompleted] = useState<boolean>(false)
  const [balance, setBalance] = useState<number | undefined>()
  const tokenContract = Tokens.getTokenContract(signer, selectedAsset)
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const mintTokenValue = '5'
  const depositTokenValue = '1'

  const isApproveDisabled =
    !isSupportedNetwork || loading || approved || !balance
  const isStakeDisabled =
    !isSupportedNetwork || loading || (shouldApproveContract && !approved)

  const getTokenBalance: FetchTokenBalanceFunction = useCallback(async () => {
    try {
      const balance = await Tokens.getTokenBalance(
        tokenContract,
        currentAccount,
      )
      setBalance(Number(ethers.utils.formatUnits(balance)))
      setHasError(null)
    } catch (error) {
      setHasError(error)
    }
  }, [currentAccount, tokenContract])

  const checkAllowance: CheckAllowanceFunction = useCallback(async () => {
    try {
      const approvedTokens = await Tokens.getAllowance(
        tokenContract,
        currentAccount,
        'deposit',
      )
      setShouldApproveContract(approvedTokens.toString() === '0')
      setHasError(null)
    } catch (error) {
      setHasError(error)
    }
  }, [currentAccount, tokenContract])

  useEffect(() => {
    if (isSupportedNetwork) {
      void checkAllowance()
    }
  }, [checkAllowance, isSupportedNetwork])

  useEffect(() => {
    void getTokenBalance()
  }, [getTokenBalance, depositCompleted, approved]) //Why do we need approved as dep here?

  const mint = async () => {
    setLoading(true)
    try {
      const response = await Tokens.mintToken(tokenContract, mintTokenValue)
      await response.wait()
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
      const response = await Tokens.approveToken(tokenContract, 'deposit')
      const isApproved = await response.wait()

      setApproved(!!isApproved)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setDepositCompleted(false)
    setHasError(null)
  }

  const deposit = async () => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.deposit(
        lendingPoolContract,
        selectedAddress,
        depositTokenValue,
        currentAccount,
      )
      const isDeposited = await response.wait()
      setDepositCompleted(!!isDeposited)
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
        <h3>
          {t('deposit.depositAsset')} {selectedAsset}
        </h3>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Amount to deposit: {depositTokenValue} {selectedAsset}
          </span>
          <button disabled={!isSupportedNetwork} onClick={mint}>
            Get {mintTokenValue} {selectedAsset}
          </button>{' '}
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Balance:</span>
          <span>
            {balance} {selectedAsset}
          </span>
        </Grid>
        <p style={{ color: 'orange' }}>{loading && 'Please wait...'}</p>
        <p style={{ color: 'green' }}>
          {depositCompleted && 'Successfully completed!'}
        </p>

        <p style={{ color: 'red' }}>{hasError && 'Something went wrong'}</p>
        {shouldApproveContract && (
          <button disabled={isApproveDisabled} onClick={approve}>
            Approve to continue
          </button>
        )}
        <button disabled={isStakeDisabled} onClick={deposit}>
          Deposit
        </button>
      </StackLayout>
    </BoxLayout>
  )
}
