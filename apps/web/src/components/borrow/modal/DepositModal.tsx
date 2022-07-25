import React, { useCallback, useEffect, useState } from 'react'
import {
  BoxLayout,
  Button,
  CenterLayout,
  Icon,
  Modal,
  StackLayout,
  Text,
} from '@bloxifi/ui'
import { BorrowAndLending, Tokens } from '@bloxifi/core'
import { CheckAllowanceFunction } from '@bloxifi/types'

import { TableInput } from '../table/TableInput'

import { Web3Container } from '@/containers/Web3Container'
import { WalletBalance } from '@/containers/WalletContainer'
import { TransactionOverview } from '../table/TransactionOverview'

interface Props {
  /**
   * Boolean value that defines if modal is open or closed
   */
  isOpen?: boolean
  /**
   * Function that defines closing of modal
   */
  onClose?: () => void
  /**
   * Selected asset reserve data
   */
  reserveData: WalletBalance
}

export const DepositModal = ({ isOpen, onClose, reserveData }: Props) => {
  const [amountError, setAmountError] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState()
  const [loading, setLoading] = useState(false)

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [depositCompleted, setDepositCompleted] = useState<boolean>(false)
  const tokenContract = Tokens.getTokenContract(signer, reserveData.symbol)
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const isApproveDisabled =
    !isSupportedNetwork || loading || approved || !reserveData.balance
  const isDepositDisabled =
    !isSupportedNetwork ||
    loading ||
    amountError ||
    !amount ||
    hasError ||
    (shouldApproveContract && !approved)

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
    setAmount(undefined)
  }

  const deposit = async () => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.deposit(
        lendingPoolContract,
        reserveData.underlyingAsset,
        amount,
        currentAccount,
      )
      const isDeposited = await response.wait()
      setDepositCompleted(!!isDeposited)
      resetState()
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    const number = Number(value)
    if (number > Number(reserveData.balance) || number === 0) {
      setAmountError(true)
    } else {
      setAmountError(false)
    }
    setAmount(value)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StackLayout gap={5}>
        <StackLayout gap={3}>
          <TableInput
            reserveData={reserveData}
            amount={amount}
            handleInputChange={handleInputChange}
            status={amountError ? 'error' : undefined}
          />
          <TransactionOverview
            reserveData={reserveData}
            headers={['Supply APY', 'Health factor']}
          />
        </StackLayout>

        <BoxLayout gap={1.875}>
          {hasError ? (
            <CenterLayout>
              <Icon name="error" size={75} />
              <Text type="body 2">Transaction failed</Text>
            </CenterLayout>
          ) : depositCompleted ? (
            <CenterLayout>
              <Icon name="success" size={75} />
              <Text type="body 2">Deposit successful</Text>
            </CenterLayout>
          ) : (
            <StackLayout gap={1}>
              {shouldApproveContract && (
                <Button
                  className="u-full-width"
                  appearance="dark"
                  size="large"
                  variant="large"
                  disabled={isApproveDisabled}
                  onClick={approve}
                >
                  Approve to conitinue
                </Button>
              )}
              <Button
                className="u-full-width"
                appearance="secondary"
                size="large"
                variant="large"
                disabled={isDepositDisabled}
                onClick={deposit}
              >
                Deposit {reserveData.symbol}
              </Button>
            </StackLayout>
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
