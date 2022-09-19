import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, Button, Modal, StackLayout, Text } from '@bloxifi/ui'
import {
  BorrowAndLending,
  calculateHealthFactor,
  useFormatAPY,
} from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHealthFactor } from '@bloxifi/core/src/hooks/useHealthFactor'

import { TransactionOverview } from '../table/TransactionOverview'

import { AmountInput } from './Amountlnput'
import { ModalState } from './ModalState'

import { Web3Container } from '@/containers/Web3Container'
import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'

export type RepayModalData = Pick<
  UserReserveData,
  | 'underlyingAsset'
  | 'currentTotalDebt'
  | 'symbol'
  | 'icon'
  | 'priceInEth'
  | 'balance'
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
  reserveData?: RepayModalData
}

export const RepayModal = ({
  isOpen,
  onClose,
  reserveData = {} as UserReserveData,
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

  const [repayCompleted, setRepayCompleted] = useState<boolean>(false)

  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const repay = async (amount: number) => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.repay(
        lendingPoolContract,
        reserveData.underlyingAsset,
        amount,
        currentAccount,
      )
      const isRepayed = await response.wait()
      await waitTransactionConfirmation(isRepayed.transactionHash, refetch)

      setRepayCompleted(!!isRepayed)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  //Maximum amount that can be repayed is min value of current token balance or current token borrow debt.
  const maxRepayAmount = Math.min(
    reserveData.balance,
    reserveData.currentTotalDebt,
  )
  const repayValidationSchemaa = Yup.object().shape({
    amount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .max(maxRepayAmount, t('global.errors.exceededBalance'))
      .required(t('global.errors.required')),
    /**
     * TODO need to research more requirements.
     * - Compare with health factor
     * - Max amount to withdraw
     */
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: repayValidationSchemaa,
    onSubmit: values => repay(Number(values.amount)),
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
    setRepayCompleted(false)
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || repayCompleted
  const isRepayDisabled = isInputDisabled || !!errors.amount || !values.amount

  const calculateRemainingDebt = () => {
    const remainingSupply = reserveData.currentTotalDebt - Number(values.amount)
    if (remainingSupply > 0 && Number(values.amount) > 0) {
      return remainingSupply
    }
    return 0
  }

  const remainingDebt = useFormatAPY({
    value: calculateRemainingDebt(),
  })

  const futureHealthFactor = calculateHealthFactor({
    totalCollateralETH,
    totalBorrowETH:
      totalBorrowETH - Number(values.amount) * reserveData.priceInEth,
  })
  return (
    <Modal isOpen={isOpen} onClose={onClose} disableCloseButton={loading}>
      {loading || hasError || repayCompleted ? (
        <ModalState
          loading={loading}
          error={hasError}
          success={repayCompleted}
          messages={{ success: t('global.notifications.repay_successful') }}
        />
      ) : (
        <>
          <BoxLayout gap={0.25} />
          <StackLayout gap={5}>
            <StackLayout gap={2}>
              <BoxLayout gap={1.25}>
                <Text color="oxfordBlue" type="heading 2" as="span">
                  {t('deposit.repayAsset')}
                </Text>
              </BoxLayout>
              <AmountInput
                name="amount"
                max={maxRepayAmount}
                reserveData={{
                  balance: maxRepayAmount,
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
                headers={['remainingDebt', 'healthFactor']}
                remainingDebt={remainingDebt}
                amount={values.amount}
                symbol={reserveData.symbol}
              />
            </StackLayout>

            <BoxLayout gap={1.875}>
              <Button
                className="u-full-width"
                appearance="dark"
                size="large"
                variant="large"
                disabled={isRepayDisabled}
                onClick={submitForm}
              >
                {t('global.buttons.repay')} {reserveData.symbol}
              </Button>
            </BoxLayout>
          </StackLayout>
        </>
      )}
    </Modal>
  )
}
