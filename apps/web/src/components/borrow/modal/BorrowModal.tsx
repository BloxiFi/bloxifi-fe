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
import { BorrowAndLending } from '@bloxifi/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { TableInput } from '../table/TableInput'
import { TransactionOverview } from '../table/TransactionOverview'

import { Web3Container } from '@/containers/Web3Container'
import { ReservesData } from '@/containers/WalletContainer'

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
  /**
   * Health factor - the 'health' of the loans within the system
   */
  healthFactor?: number
}

export const BorrowModal = ({
  isOpen,
  onClose,
  reserveData = {} as ReservesData,
  healthFactor,
}: Props) => {
  const { t } = useTranslation()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [borrowCompleted, setBorrowCompleted] = useState<boolean>(false)

  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

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
      setBorrowCompleted(!!isBorrowed)
      resetState()
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const depositValidationSchemaa = Yup.object().shape({
    amount: Yup.number()
      .typeError(t('global.errors.numbersOnly'))
      .positive(t('global.errors.positiveValue'))
      .max(Number(reserveData.balance), t('global.errors.exceededBalance'))
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
  }, [resetForm])

  useEffect(() => {
    resetState()
    setBorrowCompleted(false)
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || borrowCompleted
  const isBorrowDisabled = isInputDisabled || !!errors.amount || !values.amount

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StackLayout gap={5}>
        <StackLayout gap={3}>
          <TableInput
            name="amount"
            type="number"
            max={reserveData.balance}
            reserveData={{
              balance: reserveData.balance,
              symbol: reserveData.symbol,
            }}
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldValue={setFieldValue}
            status={errors.amount && touched.amount ? 'error' : undefined}
            info={errors.amount && touched.amount && errors.amount}
            disabled={isInputDisabled}
            title={t('deposit.borrowAsset')}
          />
          <TransactionOverview
            healthFactor={healthFactor}
            headers={['healthFactor']}
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
              appearance="dark"
              size="large"
              variant="large"
              disabled={isBorrowDisabled}
              onClick={submitForm}
            >
              {t('global.buttons.borrow')} {reserveData.symbol}
            </Button>
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
