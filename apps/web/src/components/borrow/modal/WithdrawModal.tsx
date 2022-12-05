import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, Button, Modal, StackLayout, Text } from '@bloxifi/ui'
import {
  bigNumberToString,
  BorrowAndLending,
  calculateAssetCollateralAfterTx,
  calculateHealthFactor,
  isHealthFactorInfinity,
  MIN_HEALTH_FACTOR_VALUE,
  MIN_VALUE_FOR_TRANSACTION,
  numberToBigNumber,
  SCALING_FACTOR,
  stringToBigNumber,
  useFormatNumber,
} from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHealthFactor } from '@bloxifi/core/src/hooks/useHealthFactor'
import { BigNumber } from 'ethers'

import { TransactionOverview } from '../table/TransactionOverview'

import { AmountInput } from './Amountlnput'
import { ModalState } from './ModalState'
import { ErrorMessage } from './ErrorMessage'

import { Web3Container } from '@/containers/Web3Container'
import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'

export type WithdrawModalData = Pick<
  UserReserveData,
  | 'underlyingAsset'
  | 'balance'
  | 'symbol'
  | 'currentATokenBalance'
  | 'icon'
  | 'priceInEth'
  | 'usageAsCollateralEnabledOnUser'
  | 'reserveLiquidationThreshold'
>

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
  reserveData?: WithdrawModalData
}

export const WithdrawModal = ({
  isOpen,
  onClose,
  reserveData = {} as WithdrawModalData,
}: Props) => {
  const { t } = useTranslation()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
    waitTransactionConfirmation,
  } = Web3Container.useContainer()
  const { refetch } = WalletContainer.useContainer()

  const signer = provider.getSigner()
  const { healthFactor, totalCollateralETH, totalBorrowETH } = useHealthFactor({
    currentAccount,
  })

  const [hasError, setHasError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [withdrawCompleted, setWithdrawCompleted] = useState<boolean>(false)
  const [futureHealthFactor, setFutureHealthFactor] =
    useState<number>(undefined)
  const [maxAmountToWithdraw, setMaxAmountToWithdraw] = useState('')
  const isCollateralEnabled = reserveData.usageAsCollateralEnabledOnUser
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  //The maximum amount to withdraw should go up to the minimum health factor value, until it reaches MIN_HEALTH_FACTOR_VALUE
  const calculateAmoutThatReachHFLimit = useCallback(() => {
    const price = numberToBigNumber(reserveData.priceInEth)
    const ltv = numberToBigNumber(reserveData.reserveLiquidationThreshold)
    /**
     * (totalCollateralETH - totalBorrowETH * MIN_HEALTH_FACTOR_VALUE) / priceInEth * reserveLiquidationThreshold
     */
    return totalCollateralETH
      .sub(
        totalBorrowETH
          .mul(
            numberToBigNumber(
              MIN_HEALTH_FACTOR_VALUE + MIN_VALUE_FOR_TRANSACTION,
            ),
          )
          .div(SCALING_FACTOR),
      )
      .mul(SCALING_FACTOR)
      .div(price.mul(ltv).div(SCALING_FACTOR))
  }, [
    reserveData.priceInEth,
    reserveData.reserveLiquidationThreshold,
    totalBorrowETH,
    totalCollateralETH,
  ])

  useEffect(() => {
    if (isOpen) {
      let maxWithdraw = reserveData.currentATokenBalance
      if (isCollateralEnabled) {
        const amountToReachHFLimit = calculateAmoutThatReachHFLimit()
        if (
          stringToBigNumber(reserveData.currentATokenBalance).gt(
            amountToReachHFLimit,
          )
        ) {
          maxWithdraw = bigNumberToString(amountToReachHFLimit)
        }
      }
      setMaxAmountToWithdraw(maxWithdraw)
    }
  }, [
    isOpen,
    calculateAmoutThatReachHFLimit,
    reserveData.currentATokenBalance,
    isCollateralEnabled,
  ])

  const withdraw = async (amount: string) => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.withdraw(
        lendingPoolContract,
        reserveData.underlyingAsset,
        amount,
        currentAccount,
      )
      const isCompleted = await response.wait()
      await waitTransactionConfirmation(isCompleted.transactionHash, refetch)

      setWithdrawCompleted(!!isCompleted)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const withdrawValidationSchemaa = Yup.object().shape({
    amount: Yup.string()
      .test('is-exceeded', t('global.errors.exceededBalance'), (val: string) =>
        stringToBigNumber(val).lte(stringToBigNumber(maxAmountToWithdraw)),
      )
      .test(
        'is-zero',
        t('global.errors.positiveValue'),
        (val: string) => !stringToBigNumber(val).isZero(),
      )
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: withdrawValidationSchemaa,
    onSubmit: values => withdraw(values.amount),
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

  const getTotalCollateralAfterWithdraw = useCallback(() => {
    if (reserveData.usageAsCollateralEnabledOnUser) {
      const assetCollateralAfterTX = calculateAssetCollateralAfterTx(
        values.amount,
        reserveData.priceInEth,
        reserveData.reserveLiquidationThreshold,
      )

      return totalCollateralETH.sub(BigNumber.from(assetCollateralAfterTX))
    }
    return totalCollateralETH
  }, [
    values.amount,
    totalCollateralETH,
    reserveData.priceInEth,
    reserveData.reserveLiquidationThreshold,
    reserveData.usageAsCollateralEnabledOnUser,
  ])

  useEffect(() => {
    values.amount &&
      setFutureHealthFactor(
        calculateHealthFactor({
          totalCollateralETH: getTotalCollateralAfterWithdraw(),
          totalBorrowETH,
        }),
      )
  }, [values.amount, totalBorrowETH, getTotalCollateralAfterWithdraw])

  const resetState = useCallback(() => {
    setHasError(undefined)
    resetForm()
    refetch()
  }, [refetch, resetForm])

  useEffect(() => {
    if (isOpen) {
      resetState()
      setWithdrawCompleted(false)
      setFutureHealthFactor(undefined)
    }
  }, [isOpen, resetState])

  const calculateRemainingSupply = () => {
    const remainingSupply =
      Number(reserveData.currentATokenBalance) - Number(values.amount)
    if (remainingSupply > 0) {
      return remainingSupply
    }
    return 0
  }

  const remainingSupply = useFormatNumber({
    value: calculateRemainingSupply(),
  })
  const isHealthFactorReached =
    values.amount &&
    isCollateralEnabled &&
    !isHealthFactorInfinity(futureHealthFactor) &&
    futureHealthFactor < MIN_HEALTH_FACTOR_VALUE
  const isInputDisabled = !isSupportedNetwork || loading || withdrawCompleted
  const isWithdrawDisabled =
    isInputDisabled ||
    !!errors.amount ||
    !values.amount ||
    isHealthFactorReached

  const setMaxValue = async () => {
    await setFieldValue('amount', maxAmountToWithdraw, true)
    await setFieldTouched('amount', true, true)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} disableCloseButton={loading}>
      {loading || hasError || withdrawCompleted ? (
        <ModalState
          loading={loading}
          error={hasError}
          success={withdrawCompleted}
          messages={{ success: t('global.notifications.withdraw_successful') }}
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
                  data-cy="withdraw modal title"
                >
                  {t('deposit.withdrawAsset')}
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
                symbol={reserveData.symbol}
                remainingSupply={remainingSupply}
                amount={values.amount}
                headers={['remainingSupply', 'healthFactor']}
              />

              <ErrorMessage
                message={
                  isHealthFactorReached && t('global.errors.healthFactor')
                }
              />
            </StackLayout>

            <BoxLayout gap={1.875}>
              <Button
                className="u-full-width"
                appearance="dark"
                size="large"
                variant="large"
                disabled={isWithdrawDisabled}
                onClick={submitForm}
                data-cy={'withdrawButtonOnModal ' + reserveData.symbol}
              >
                {t('global.buttons.withdraw')} {reserveData.symbol}
              </Button>
            </BoxLayout>
          </StackLayout>
        </>
      )}
    </Modal>
  )
}
