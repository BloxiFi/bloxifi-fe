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
import { BorrowAndLending } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'

import { TableInput } from '../table/TableInput'
import { TransactionOverview } from '../table/TransactionOverview'

import { Web3Container } from '@/containers/Web3Container'
import { initailReserveData } from '@/containers/WalletContainer'

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
  reserveData?: typeof initailReserveData
}

export const BorrowModal = ({
  isOpen,
  onClose,
  reserveData = initailReserveData,
}: Props) => {
  const { t } = useTranslation()
  const [amountError, setAmountError] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState()
  const [loading, setLoading] = useState(false)

  const [healthFactor, setHealthFactor] = useState<number>()

  const [borrowCompleted, setBorrowCompleted] = useState<boolean>(false)

  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const isBorrowDisabled =
    !isSupportedNetwork || loading || amountError || !amount || hasError

  const resetState = () => {
    setAmount(undefined)
  }

  const getHealthFactor = async () => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.getUserAccountData(
        lendingPoolContract,
        currentAccount,
      )
      setHealthFactor(Number(ethers.utils.formatUnits(response.healthFactor)))
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    resetState()
    void getHealthFactor()
  }, [isOpen])

  const borrow = async () => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.borrow(
        lendingPoolContract,
        reserveData.underlyingAsset,
        amount,
        currentAccount,
      )
      const isBorrowed = await response.wait()
      setBorrowCompleted(!!isBorrowed)
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
            title={t('deposit.borrowAsset')}
          />
          <TransactionOverview
            healthFactor={healthFactor}
            headers={['healthFactor']}
          />
        </StackLayout>

        <BoxLayout gap={1.875}>
          {hasError ? (
            <CenterLayout>
              <Icon name="error" size={75} />
              <Text type="body 2">
                {t('global.notifications.transaction_failed')}
              </Text>
            </CenterLayout>
          ) : borrowCompleted ? (
            <CenterLayout>
              <Icon name="success" size={75} />
              <Text type="body 2">
                {t('global.notifications.borrow_successful')}
              </Text>
            </CenterLayout>
          ) : (
            <Button
              className="u-full-width"
              appearance="secondary"
              size="large"
              variant="large"
              disabled={isBorrowDisabled}
              onClick={borrow}
            >
              {t('global.buttons.borrow')} {reserveData.symbol}
            </Button>
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
