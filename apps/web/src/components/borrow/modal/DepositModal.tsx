import React, { useCallback, useEffect, useState } from 'react'
import { BoxLayout, Button, Modal, StackLayout, Text } from '@bloxifi/ui'
import {
  BorrowAndLending,
  calculateAssetCollateralAfterTx,
  calculateHealthFactor,
  stringToBigNumber,
  Tokens,
} from '@bloxifi/core'
import { CheckAllowanceFunction } from '@bloxifi/types'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHealthFactor } from '@bloxifi/core/src/hooks/useHealthFactor'
import { BigNumber } from 'ethers'

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

export const DepositModal = ({
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
    state: { userReserves },
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

  const [depositCompleted, setDepositCompleted] = useState<boolean>(false)
  const tokenContract = reserveData.symbol
    ? Tokens.getERC20TokenContract(signer, reserveData.underlyingAsset)
    : null
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const isApproveDisabled =
    !isSupportedNetwork || loading || approved || !reserveData.balance

  const isEnabledAsCollateral = userReserves.find(
    ({ usageAsCollateralEnabledOnUser, symbol }) =>
      symbol === reserveData.symbol && usageAsCollateralEnabledOnUser,
  )

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

  const deposit = async (amount: string) => {
    setLoading(true)
    try {
      const response = await BorrowAndLending.lendingPool.deposit(
        lendingPoolContract,
        reserveData.underlyingAsset,
        stringToBigNumber(amount, reserveData.decimals),
        currentAccount,
      )
      const isDeposited = await response.wait()
      await waitTransactionConfirmation(isDeposited.transactionHash, refetch)

      setDepositCompleted(!!isDeposited)
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }

  const depositValidationSchemaa = Yup.object().shape({
    amount: Yup.string()
      .test('is-exceeded', t('global.errors.exceededBalance'), (val: string) =>
        stringToBigNumber(val, reserveData.decimals).lte(
          stringToBigNumber(reserveData.balance, reserveData.decimals),
        ),
      )
      .test(
        'is-zero',
        t('global.errors.positiveValue'),
        (val: string) => !stringToBigNumber(val, reserveData.decimals).isZero(),
      )
      .required(t('global.errors.required')),
  })

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: depositValidationSchemaa,
    onSubmit: values => deposit(values.amount),
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
      setDepositCompleted(false)
      setShouldApproveContract(false)
      setApproved(false)
    }
  }, [isOpen, resetState])

  const isInputDisabled = !isSupportedNetwork || loading || depositCompleted
  const isDepositDisabled =
    isInputDisabled ||
    !!errors.amount ||
    !values.amount ||
    hasError ||
    (shouldApproveContract && !approved)

  const getTotalCollateralAfterDeposit = () => {
    if (isEnabledAsCollateral) {
      const assetCollateralAfterTX = calculateAssetCollateralAfterTx(
        values.amount,
        reserveData.decimals,
        reserveData.priceInEth,
        reserveData.reserveLiquidationThreshold,
      )
      return totalCollateralETH.add(BigNumber.from(assetCollateralAfterTX))
    }
    return totalCollateralETH
  }
  const futureHealthFactor =
    values.amount &&
    calculateHealthFactor({
      totalCollateralETH: getTotalCollateralAfterDeposit(),
      totalBorrowETH,
    })

  const setMaxValue = async () => {
    await setFieldValue('amount', reserveData.balance, true)
    await setFieldTouched('amount', true, true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} disableCloseButton={loading}>
      {loading || hasError || depositCompleted ? (
        <ModalState
          loading={loading}
          error={hasError}
          success={depositCompleted}
          messages={{ success: t('global.notifications.deposit_successful') }}
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
                  data-cy="deposit modal title"
                >
                  {t('deposit.depositAsset')}
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
                supplyAPY={reserveData.supplyAPY}
                headers={['supplyAPY', 'healthFactor']}
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
                  type="submit"
                  disabled={isDepositDisabled}
                  onClick={submitForm}
                  data-cy={'depositButtonOnModal ' + reserveData.symbol}
                >
                  {t('global.buttons.deposit')} {reserveData.symbol}
                </Button>
              </StackLayout>
            </BoxLayout>
          </StackLayout>
        </>
      )}
    </Modal>
  )
}
