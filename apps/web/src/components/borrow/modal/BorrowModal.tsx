import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, Button, Modal, StackLayout, Text } from '@bloxifi/ui'
import {
  bigNumberToString,
  BorrowAndLending,
  calculateHealthFactor,
  getMaxBorrowAmount,
  isHealthFactorInfinity,
  MIN_HEALTH_FACTOR_VALUE,
  numberToBigNumber,
  SCALING_FACTOR,
  stringToBigNumber,
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
import { ErrorMessage } from './ErrorMessage'

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
    state: {
      userAccountData: { availableBorrowsETH, totalDebtETH },
    },
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
  const [futureHealthFactor, setFutureHealthFactor] =
    useState<number>(undefined)
  const [maxAmountToBorrow, setMaxAmountToBorrow] = useState('')

  const tokenContract = reserveData.symbol
    ? Tokens.getERC20TokenContract(signer, reserveData.underlyingAsset)
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

  const borrow = async (amount: string) => {
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

  const depositValidationSchemaa = Yup.object().shape({
    amount: Yup.string()
      .test('is-exceeded', t('global.errors.exceededBalance'), (val: string) =>
        stringToBigNumber(val).lte(stringToBigNumber(maxAmountToBorrow)),
      )
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: depositValidationSchemaa,
    onSubmit: values => borrow(values.amount),
  })

  const {
    values,
    errors,
    touched,
    handleChange,
    submitForm,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = formik

  const resetState = useCallback(() => {
    setHasError(undefined)
    resetForm()
    refetch()
  }, [refetch, resetForm])

  useEffect(() => {
    if (isOpen) {
      resetState()
      setBorrowCompleted(false)
      setShouldApproveContract(false)
      setFutureHealthFactor(undefined)
    }
  }, [isOpen, resetState])

  const isHealthFactorReached =
    !isHealthFactorInfinity(futureHealthFactor) &&
    values.amount &&
    futureHealthFactor < MIN_HEALTH_FACTOR_VALUE
  const isInputDisabled = !isSupportedNetwork || loading || borrowCompleted
  const isBorrowDisabled =
    isInputDisabled ||
    !!errors.amount ||
    !values.amount ||
    (shouldApproveContract && !approved) ||
    isHealthFactorReached
  const isApproveDisabled = !isSupportedNetwork || loading || approved

  useEffect(() => {
    if (isOpen) {
      setMaxAmountToBorrow(
        bigNumberToString(
          getMaxBorrowAmount({
            aTokenBalance: reserveData.aTokenBalance,
            availableBorrowsETH,
            priceInEth: reserveData.priceInEth,
            totalCollateralETH,
            totalDebtETH,
          }),
        ),
      )

      //Calculate future HF
      if (values.amount) {
        setFutureHealthFactor(
          calculateHealthFactor({
            totalCollateralETH,
            totalBorrowETH: totalBorrowETH.add(
              stringToBigNumber(values.amount)
                .mul(numberToBigNumber(reserveData.priceInEth))
                .div(SCALING_FACTOR),
            ),
          }),
        )
      }
    }
  }, [
    isOpen,
    values.amount,
    totalCollateralETH,
    totalBorrowETH,
    reserveData.priceInEth,
    availableBorrowsETH,
    reserveData.aTokenBalance,
    totalDebtETH,
  ])

  const setMaxValue = async () => {
    await setFieldValue('amount', maxAmountToBorrow, true)
    await setFieldTouched('amount', true, true)
  }

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
          <StackLayout gap={3}>
            <StackLayout gap={2}>
              <BoxLayout gap={1.25}>
                <Text
                  color="oxfordBlue"
                  type="heading 2"
                  as="span"
                  data-cy="borrow modal title"
                >
                  {t('deposit.borrowAsset')}
                </Text>
              </BoxLayout>
              <AmountInput
                name="amount"
                max={reserveData.balance}
                reserveData={{
                  symbol: reserveData.symbol,
                  icon: reserveData.icon,
                }}
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                setMaxValue={setMaxValue}
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
              <ErrorMessage
                message={
                  isHealthFactorReached && t('global.errors.healthFactor')
                }
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
                  data-cy={'borrowButtonOnModal ' + reserveData.symbol}
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
