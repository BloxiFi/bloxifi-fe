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
import { BorrowAndLending, Tokens } from '@bloxifi/core'
import { CheckAllowanceFunction } from '@bloxifi/types'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
import { Formik } from 'formik'
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
}

const initailReserveData = {
  balance: undefined,
  icon: '',
  fullName: '',
  supplyAPY: undefined,
  variableBorrowAPY: undefined,
  id: '',
  name: null,
  symbol: null,
  decimals: undefined,
  totalATokenSupply: undefined,
  totalCurrentVariableDebt: undefined,
  liquidityRate: undefined,
  variableBorrowRate: undefined,
  underlyingAsset: '',
}

export const DepositModal = ({
  isOpen,
  onClose,
  reserveData = initailReserveData,
}: Props) => {
  const { t } = useTranslation()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState()
  const [loading, setLoading] = useState(false)

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [healthFactor, setHealthFactor] = useState<number>()

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
    void getHealthFactor()
  }, [])

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
      .max(Number(reserveData.balance), t('global.errors.exceededBalance'))
      .required(t('global.errors.required')),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Formik
        initialValues={{ amount: '' }}
        validationSchema={depositValidationSchemaa}
        onSubmit={values => deposit(Number(values.amount))}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => {
          const isDepositDisabled =
            !isSupportedNetwork ||
            loading ||
            !!errors.amount ||
            !values.amount ||
            hasError ||
            (shouldApproveContract && !approved)

          return (
            <form onSubmit={handleSubmit}>
              <StackLayout gap={5}>
                <StackLayout gap={3}>
                  <TableInput
                    id="amount"
                    name="amount"
                    reserveData={reserveData}
                    amount={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    status={
                      errors.amount && touched.amount ? 'error' : undefined
                    }
                    info={errors.amount && touched.amount && errors.amount}
                  />
                  <TransactionOverview
                    healthFactor={healthFactor}
                    supplyAPY={reserveData.supplyAPY}
                    headers={['supplyAPY', 'healthFactor']}
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
                        appearance="secondary"
                        size="large"
                        variant="large"
                        type="submit"
                        disabled={isDepositDisabled}
                      >
                        {t('global.buttons.deposit')} {reserveData.symbol}
                      </Button>
                    </StackLayout>
                  )}
                </BoxLayout>
              </StackLayout>
            </form>
          )
        }}
      </Formik>
    </Modal>
  )
}
