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

export type RepayModalData = Pick<
  UserReserveData,
  'underlyingAsset' | 'currentTotalDebt' | 'symbol'
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
  /**
   * Health factor - the 'health' of the loans within the system
   */
  healthFactor?: number
}

export const RepayModal = ({
  isOpen,
  onClose,
  reserveData = {} as UserReserveData,
  healthFactor,
}: Props) => {
  const { t } = useTranslation()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

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
      setRepayCompleted(!!isRepayed)
      resetState()
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const repayValidationSchemaa = Yup.object().shape({
    amount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .max(
        Number(reserveData.currentTotalDebt),
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
  }, [resetForm])

  useEffect(() => {
    resetState()
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || repayCompleted
  const isRepayDisabled = isInputDisabled || !!errors.amount || !values.amount

  const calculateRemainingDebt = () => {
    const remainingSupply = reserveData.currentTotalDebt - Number(values.amount)
    if (remainingSupply > 0) {
      return remainingSupply
    }
    return 0
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StackLayout gap={5}>
        <StackLayout gap={3}>
          <TableInput
            name="amount"
            type="number"
            max={reserveData.currentTotalDebt}
            reserveData={{
              balance: reserveData.currentTotalDebt,
              symbol: reserveData.symbol,
            }}
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldValue={setFieldValue}
            status={errors.amount && touched.amount ? 'error' : undefined}
            info={errors.amount && touched.amount && errors.amount}
            disabled={isInputDisabled}
            title={t('deposit.repayAsset')}
          />
          <TransactionOverview
            healthFactor={healthFactor}
            headers={['remainingDebt', 'healthFactor']}
            remainingDebt={useFormatAPY({
              value: calculateRemainingDebt(),
            })}
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
          ) : repayCompleted ? (
            <CenterLayout>
              <Icon name="success" size={75} />
              <Text type="body 2">
                {t('global.notifications.repay_successful')}
              </Text>
            </CenterLayout>
          ) : (
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
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
