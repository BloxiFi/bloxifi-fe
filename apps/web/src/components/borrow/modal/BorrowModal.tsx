import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, Button, Modal, StackLayout, Text } from '@bloxifi/ui'
import {
  BorrowAndLending,
  calculateHealthFactor,
  convertUSDToAssetValue,
  Tokens,
} from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { CheckAllowanceFunction } from '@bloxifi/types'
import { useHealthFactor } from '@bloxifi/core/src/hooks/useHealthFactor'

import { TransactionOverview } from '../table/TransactionOverview'

import { AmountInput } from './Amountlnput'
import { ModalState } from './ModalState'

import { Web3Container } from '@/containers/Web3Container'
import { ReservesData, WalletContainer } from '@/containers/WalletContainer'

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
  reserveData?: ReservesData
}

export const BorrowModal = ({
  isOpen,
  onClose,
  reserveData = {} as ReservesData,
}: Props) => {
  const { t } = useTranslation()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
    waitTransactionConfirmation,
  } = Web3Container.useContainer()
  const {
    state: { availableToBorrowUSD },
    refetch,
  } = WalletContainer.useContainer()

  const signer = provider.getSigner()
  const { healthFactor, totalCollateralETH, totalBorrowETH } = useHealthFactor({
    currentAccount,
  })
  const [hasError, setHasError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)

  const [borrowCompleted, setBorrowCompleted] = useState<boolean>(false)

  const tokenContract = reserveData.symbol
    ? Tokens.getTokenContract(signer, reserveData.symbol)
    : null
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const checkAllowance: CheckAllowanceFunction = useCallback(async () => {
    if (tokenContract) {
      try {
        const approvedTokens = await Tokens.getAllowance(
          tokenContract,
          currentAccount,
          'deposit',
        )
        setShouldApproveContract(approvedTokens.toString() === '0')
      } catch (error) {
        setHasError(error)
      }
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

  const borrow = async (amount: number) => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.borrow(
        lendingPoolContract,
        reserveData.underlyingAsset,
        amount,
        currentAccount,
      )
      const isBorrowed = await response.wait()
      await waitTransactionConfirmation(isBorrowed.transactionHash, refetch)

      setBorrowCompleted(!!isBorrowed)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const availableToBorrow = convertUSDToAssetValue(
    availableToBorrowUSD,
    reserveData.priceInEth,
    reserveData.usdPriceEth,
  )

  const depositValidationSchemaa = Yup.object().shape({
    amount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .max(Number(availableToBorrow), t('global.errors.exceededBalance'))
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: depositValidationSchemaa,
    onSubmit: values => borrow(Number(values.amount)),
  })

  const {
    values,
    errors,
    touched,
    handleChange,
    submitForm,
    handleBlur,
    setFieldValue,
    resetForm,
  } = formik

  const resetState = useCallback(() => {
    setHasError(undefined)
    resetForm()
    refetch()
  }, [resetForm])

  useEffect(() => {
    resetState()
    setBorrowCompleted(false)
    setShouldApproveContract(false)
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || borrowCompleted
  const isBorrowDisabled =
    isInputDisabled ||
    !!errors.amount ||
    !values.amount ||
    (shouldApproveContract && !approved)
  const isApproveDisabled = !isSupportedNetwork || loading || approved

  const futureHealthFactor = calculateHealthFactor({
    totalCollateralETH,
    totalBorrowETH:
      totalBorrowETH + Number(values.amount) * reserveData.priceInEth,
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} disableCloseButton={loading}>
      {loading || hasError || borrowCompleted ? (
        <ModalState
          loading={loading}
          error={hasError}
          success={borrowCompleted}
          messages={{ success: t('global.notifications.borrow_successful') }}
        />
      ) : (
        <>
          <BoxLayout gap={0.25} />
          <StackLayout gap={5}>
            <StackLayout gap={2}>
              <BoxLayout gap={1.25}>
                <Text color="oxfordBlue" type="heading 2" as="span">
                  {t('deposit.borrowAsset')}
                </Text>
              </BoxLayout>
              <AmountInput
                name="amount"
                max={reserveData.balance}
                reserveData={{
                  balance: availableToBorrow,
                  symbol: reserveData.symbol,
                  icon: reserveData.icon,
                }}
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                setFieldValue={setFieldValue}
                status={errors.amount && touched.amount ? 'error' : undefined}
                info={errors.amount && touched.amount && errors.amount}
                disabled={isInputDisabled}
              />
              <TransactionOverview
                healthFactor={healthFactor}
                futureHealthFactor={futureHealthFactor}
                headers={['healthFactor']}
                amount={values.amount}
              />
            </StackLayout>

            <BoxLayout gap={1.875}>
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
                    {t('global.buttons.approve')}
                  </Button>
                )}
                <Button
                  className="u-full-width"
                  appearance="dark"
                  size="large"
                  variant="large"
                  disabled={isBorrowDisabled}
                  onClick={submitForm}
                >
                  {t('global.buttons.borrow')} {reserveData.symbol}
                </Button>
              </StackLayout>
            </BoxLayout>
          </StackLayout>
        </>
      )}
    </Modal>
  )
}
