import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useContext,
} from 'react'
import {
  BaseInput,
  BoxLayout,
  Button,
  CellProps,
  CenterLayout,
  ColumnData,
  ColumnLayout,
  Icon,
  Modal,
  StackLayout,
  Table,
  Text,
} from '@bloxifi/ui'
import { ThemeContext } from 'styled-components'
import { BorrowAndLending, Tokens } from '@bloxifi/core'
import { CheckAllowanceFunction } from '@bloxifi/types'

import { FormattedNumber } from '../FormattedNumber'

import { Web3Container } from '@/containers/Web3Container'
import { WalletBalance } from '@/containers/WalletContainer'

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
  reserveData: WalletBalance
}

export const DepositModal = ({ isOpen, onClose, reserveData }: Props) => {
  const themeContext = useContext(ThemeContext)
  const [amountError, setAmountError] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>()

  const {
    state: { currentAccount, provider, isSupportedNetwork },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()

  const [hasError, setHasError] = useState()
  const [loading, setLoading] = useState(false)

  const [shouldApproveContract, setShouldApproveContract] = useState(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [depositCompleted, setDepositCompleted] = useState<boolean>(false)
  const tokenContract = Tokens.getTokenContract(signer, reserveData.symbol)
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const isApproveDisabled =
    !isSupportedNetwork || loading || approved || !reserveData.balance
  const isDepositDisabled =
    !isSupportedNetwork ||
    loading ||
    amountError ||
    !amount ||
    hasError ||
    (shouldApproveContract && !approved)

  const checkAllowance: CheckAllowanceFunction = useCallback(async () => {
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

  const resetState = () => {
    setAmount(undefined)
  }

  const deposit = async () => {
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
      resetState()
    } catch (error) {
      setHasError(error)
    } finally {
      setLoading(false)
    }
  }
  const Title = () => (
    <Text color="oxfordBlue" type="heading 2" as="span">
      Deposit asset
    </Text>
  )

  const transactionData = [
    {
      name: 'Supply APY',
    },
    {
      name: 'Health factor',
    },
  ]
  const handleInputCHange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value > Number(reserveData.balance) || value === 0) {
      setAmountError(true)
    } else {
      setAmountError(false)
    }
    setAmount(value)
  }
  const tableColumns = {
    action: {
      header: 'Amount',
      Cell: () => (
        <ColumnLayout gap={0.5}>
          <StackLayout>
            <BaseInput
              status={amountError ? 'error' : undefined}
              onChange={handleInputCHange}
              value={amount}
            />
          </StackLayout>
          <Button
            appearance="secondary"
            variant="thin"
            size="small"
            className="u-fit-content-width"
            onClick={() => setAmount(Number(reserveData.balance))}
          >
            MAX
          </Button>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    asset: {
      header: '',
      Cell: ({ data: { symbol } }) => <span>{symbol}</span>,
      alignText: 'right',
    },
  } as Record<string, ColumnData<WalletBalance>>

  const getValue = (index: number) => {
    switch (index) {
      case 0:
        return (
          <ColumnLayout align="flex-end" center>
            <Text as="span" type="body 1" color="oxfordBlue">
              <FormattedNumber value={reserveData.supplyAPY} percent />
            </Text>
          </ColumnLayout>
        )
      case 1:
        return (
          <StackLayout>
            <ColumnLayout align="flex-end" center>
              <Icon name="union" size={16} color={themeContext.buttonDark} />
              <Icon
                name="arrow-right"
                size={15}
                color={themeContext.buttonDark}
              />
              <Text as="span" type="body 1" color="oxfordBlue">
                1.00
              </Text>
            </ColumnLayout>
            <Text as="span" type="body 1" color="oxfordBlue">
              {'Liquidation at < 1.00'}
            </Text>
          </StackLayout>
        )
    }
  }

  const transactionColumns = {
    action: {
      header: 'Transaction overview',
      Cell: ({ data: { name } }) => (
        <Text type="body 3" color="oxfordBlue" as="span">
          {name}
        </Text>
      ),
      alignText: 'left',
    },
    value: {
      header: '',
      Cell: ({ index }) => getValue(index),
      alignText: 'right',
    },
  } as Record<string, ColumnData<WalletBalance>>

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StackLayout gap={5}>
        <StackLayout gap={3}>
          <Table
            compact
            columns={tableColumns}
            data={[reserveData]}
            titleComponent={<Title />}
          />
          <Table compact columns={transactionColumns} data={transactionData} />
        </StackLayout>

        <BoxLayout gap={1.875}>
          {hasError ? (
            <CenterLayout>
              <Icon name="error" size={75} />
              <Text type="body 2">Transaction failed</Text>
            </CenterLayout>
          ) : depositCompleted ? (
            <CenterLayout>
              <Icon name="success" size={75} />
              <Text type="body 2">Deposit successful</Text>
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
                  Approve to conitinue
                </Button>
              )}
              <Button
                className="u-full-width"
                appearance="secondary"
                size="large"
                variant="large"
                disabled={isDepositDisabled}
                onClick={deposit}
              >
                Deposit {reserveData.symbol}
              </Button>
            </StackLayout>
          )}
        </BoxLayout>
      </StackLayout>
    </Modal>
  )
}
