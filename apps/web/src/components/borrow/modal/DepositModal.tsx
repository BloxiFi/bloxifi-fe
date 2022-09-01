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
import { BorrowAndLending, Tokens } from '@bloxifi/core'
import { CheckAllowanceFunction } from '@bloxifi/types'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { TransactionOverview } from '../table/TransactionOverview'

import { AmountInput } from './Amountlnput'

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

export const DepositModal = ({
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

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)

  const [depositCompleted, setDepositCompleted] = useState<boolean>(false)
  const tokenContract = reserveData.symbol
    ? Tokens.getTokenContract(signer, reserveData.symbol)
    : null
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const isApproveDisabled =
    !isSupportedNetwork || loading || approved || !reserveData.balance

  const checkAllowance: CheckAllowanceFunction = useCallback(async () => {
    if (tokenContract) {
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

  const deposit = async (amount: number) => {
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
      .max(reserveData.balance, t('global.errors.exceededBalance'))
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: depositValidationSchemaa,
    onSubmit: values => deposit(Number(values.amount)),
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
    setDepositCompleted(false)
    setShouldApproveContract(false)
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || depositCompleted
  const isDepositDisabled =
    isInputDisabled ||
    !!errors.amount ||
    !values.amount ||
    hasError ||
    (shouldApproveContract && !approved)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <BoxLayout gap={0.25} />
      <StackLayout gap={5}>
        <StackLayout gap={2}>
          <BoxLayout gap={1.25}>
            <Text color="oxfordBlue" type="heading 2" as="span">
              {t('deposit.depositAsset')}
            </Text>
          </BoxLayout>
          <AmountInput
            name="amount"
            max={reserveData.balance}
            reserveData={{
              balance: reserveData.balance,
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
            supplyAPY={reserveData.supplyAPY}
            headers={['supplyAPY', 'healthFactor']}
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
          ) : depositCompleted ? (
            <CenterLayout>
              <Icon name="success" size={75} />
              <Text type="body 2">
                {t('global.notifications.deposit_successful')}
              </Text>
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
                  {t('global.buttons.approve')}
                </Button>
              )}
              <Button
                className="u-full-width"
                appearance="dark"
                size="large"
                variant="large"
                type="submit"
                disabled={isDepositDisabled}
                onClick={submitForm}
              >
                {t('global.buttons.deposit')} {reserveData.symbol}
              </Button>
            </StackLayout>
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
