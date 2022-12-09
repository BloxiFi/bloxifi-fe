import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, Button, Modal, StackLayout, Text } from '@bloxifi/ui'
import {
  BorrowAndLending,
  calculateHealthFactor,
  getMaxRepayAmount,
  numberToBigNumber,
  SCALING_FACTOR,
  stringToBigNumber,
  Tokens,
  useFormatNumber,
} from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHealthFactor } from '@bloxifi/core/src/hooks/useHealthFactor'
import { CheckAllowanceFunction } from 'packages/types/src'

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

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)

  const [repayCompleted, setRepayCompleted] = useState<boolean>(false)

  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)
  const tokenContract = reserveData.symbol
    ? Tokens.getERC20TokenContract(signer, reserveData.underlyingAsset)
    : null

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

  const repay = async (amount: string) => {
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

  const maxRepayAmount = getMaxRepayAmount(
    reserveData.balance,
    reserveData.currentTotalDebt,
  )

  const repayValidationSchemaa = Yup.object().shape({
    amount: Yup.string()
      .test('is-exceeded', t('global.errors.exceededBalance'), (val: string) =>
        stringToBigNumber(val).lte(stringToBigNumber(maxRepayAmount)),
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
    validationSchema: repayValidationSchemaa,
    onSubmit: values => repay(values.amount),
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
      setRepayCompleted(false)
      setShouldApproveContract(false)
      setApproved(false)
    }
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || repayCompleted
  const isRepayDisabled =
    isInputDisabled ||
    !!errors.amount ||
    !values.amount ||
    (shouldApproveContract && !approved)
  const isApproveDisabled = !isSupportedNetwork || loading || approved

  const calculateRemainingDebt = () => {
    const remainingSupply =
      Number(reserveData.currentTotalDebt) - Number(values.amount)
    if (remainingSupply > 0) {
      return remainingSupply
    }
    return 0
  }

  const remainingDebt = useFormatNumber({
    value: calculateRemainingDebt(),
  })

  const futureHealthFactor =
    values.amount &&
    isOpen &&
    calculateHealthFactor({
      totalCollateralETH,
      totalBorrowETH: totalBorrowETH.sub(
        stringToBigNumber(values.amount)
          .mul(numberToBigNumber(reserveData.priceInEth))
          .div(SCALING_FACTOR),
      ),
    })

  const setMaxValue = async () => {
    await setFieldValue('amount', maxRepayAmount, true)
    await setFieldTouched('amount', true, true)
  }

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
                <Text
                  color="oxfordBlue"
                  type="heading 2"
                  as="span"
                  data-cy="repay modal title"
                >
                  {t('deposit.repayAsset')}
                </Text>
              </BoxLayout>
              <AmountInput
                name="amount"
                max={maxRepayAmount}
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
                headers={['remainingDebt', 'healthFactor']}
                remainingDebt={remainingDebt}
                amount={values.amount}
                symbol={reserveData.symbol}
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
                  disabled={isRepayDisabled}
                  onClick={submitForm}
                  data-cy={'repayButtonOnModal ' + reserveData.symbol}
                >
                  {t('global.buttons.repay')} {reserveData.symbol}
                </Button>
              </StackLayout>
            </BoxLayout>
          </StackLayout>
        </>
      )}
    </Modal>
  )
}
