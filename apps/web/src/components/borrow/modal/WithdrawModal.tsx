import React, { useCallback, useEffect, useState } from 'react'
import {
  BoxLayout,
  Button,
  CenterLayout,
  Icon,
  Loader,
  Modal,
  StackLayout,
  Text,
} from '@bloxifi/ui'
import { BorrowAndLending, useFormatAPY } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { TableInput } from '../table/TableInput'
import { TransactionOverview } from '../table/TransactionOverview'

import { Web3Container } from '@/containers/Web3Container'
import { UserReserveData } from '@/containers/WalletContainer'

export type WithdrawModalData = Pick<
  UserReserveData,
  'underlyingAsset' | 'balance' | 'symbol' | 'currentATokenBalance'
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
  /**
   * Health factor - the 'health' of the loans within the system
   */
  healthFactor?: number
}

export const WithdrawModal = ({
  isOpen,
  onClose,
  reserveData = {} as WithdrawModalData,
  healthFactor,
}: Props) => {
  const { t } = useTranslation()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [withdrawCompleted, setWithdrawCompleted] = useState<boolean>(false)

  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const withdraw = async (amount: number) => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.withdraw(
        lendingPoolContract,
        reserveData.underlyingAsset,
        amount,
        currentAccount,
      )
      const isCompleted = await response.wait()
      setWithdrawCompleted(!!isCompleted)
      resetState()
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const withdrawValidationSchemaa = Yup.object().shape({
    amount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .max(
        Number(reserveData.currentATokenBalance),
        t('global.errors.exceededBalance'),
      )
      .required(t('global.errors.required')),
    /**
     * TODO need to research more requirements.
     * - Compare with health factor
     * - Max amount to withdraw
     */
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: withdrawValidationSchemaa,
    onSubmit: values => withdraw(Number(values.amount)),
  })

  const {
    values,
    errors,
    touched,
    submitForm,
    handleBlur,
    setFieldValue,
    resetForm,
  } = formik

  const resetState = useCallback(() => {
    setHasError(undefined)
    resetForm()
  }, [resetForm])

  useEffect(() => {
    resetState()
    setWithdrawCompleted(false)
  }, [isOpen, resetState])

  const calculateRemainingSupply = () => {
    const remainingSupply =
      reserveData.currentATokenBalance - Number(values.amount)
    if (remainingSupply > 0) {
      return remainingSupply
    }
    return 0
  }
  const isInputDisabled = !isSupportedNetwork || loading || withdrawCompleted
  const isWithdrawDisabled =
    isInputDisabled || !!errors.amount || !values.amount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFieldValue('amount', e.target.value)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StackLayout gap={5}>
        <StackLayout gap={3}>
          <TableInput
            autoFocus
            name="amount"
            type="number"
            max={reserveData.balance}
            reserveData={{
              balance: reserveData.currentATokenBalance,
              symbol: reserveData.symbol,
            }}
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldValue={setFieldValue}
            status={errors.amount && touched.amount ? 'error' : undefined}
            info={errors.amount && touched.amount && errors.amount}
            disabled={isInputDisabled}
            title={t('deposit.withdrawAsset')}
          />
          <TransactionOverview
            healthFactor={healthFactor}
            symbol={reserveData.symbol}
            remainingSupply={useFormatAPY({
              value: calculateRemainingSupply(),
            })}
            headers={['remainingSupply', 'healthFactor']}
          />
        </StackLayout>

        <BoxLayout gap={1.875}>
          {loading ? (
            <CenterLayout>
              <Loader />
            </CenterLayout>
          ) : hasError ? (
            <CenterLayout>
              <Icon name="error" size={75} />
              <Text type="body 2">
                {t('global.notifications.transaction_failed')}
              </Text>
            </CenterLayout>
          ) : withdrawCompleted ? (
            <CenterLayout>
              <Icon name="success" size={75} />
              <Text type="body 2">
                {t('global.notifications.withdraw_successful')}
              </Text>
            </CenterLayout>
          ) : (
            <Button
              className="u-full-width"
              appearance="dark"
              size="large"
              variant="large"
              disabled={isWithdrawDisabled}
              onClick={submitForm}
            >
              {t('global.buttons.withdraw')} {reserveData.symbol}
            </Button>
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
