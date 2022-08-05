import {
  BoxLayout,
  Button,
  ColumnData,
  ColumnLayout,
  Icon,
  Table,
  Text,
  Toggle,
  TruncatedText,
} from '@bloxifi/ui'
import React, { FunctionComponent, useState } from 'react'
import { BorrowAndLending } from '@bloxifi/core'

import { FormattedNumber } from '../FormattedNumber'
import { WithdrawModal, WithdrawModalData } from '../modal/WithdrawModal'

import { DepositTitleBox } from './DepositTitleBox'

import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'
import { Web3Container } from '@/containers/Web3Container'

export const YourDepositsTable: FunctionComponent = () => {
  const {
    state: {
      userReserves,
      userAccountData: { healthFactor },
    },
  } = WalletContainer.useContainer()
  const {
    state: { provider },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()
  const [selectedCollateralAsset, setSelectedCollateralAsset] =
    useState<string>()
  const userReservesWithDept = userReserves.filter(
    (reserve: UserReserveData) => reserve.currentATokenBalance !== 0,
  )
  const [modalData, setModalData] = useState<WithdrawModalData>()

  const openModal = (data: WithdrawModalData) => {
    setModalData(data)
  }

  const closeModal = () => {
    setModalData(undefined)
    //TODO update balance
  }
  const lendingPoolContract =
    BorrowAndLending.lendingPool.getLendingPoolContract(signer)

  const toggleCollateral = async (
    underlyingAsset: string,
    usageAsCollateralEnabledOnUser: boolean,
  ) => {
    setSelectedCollateralAsset(underlyingAsset)
    try {
      const response =
        await BorrowAndLending.lendingPool.setUserUseReserveAsCollateral(
          lendingPoolContract,
          underlyingAsset,
          !usageAsCollateralEnabledOnUser,
        )
      await response.wait()
      //TODO@refetch data - collateral, health factor
    } catch (error) {
      //TODO@handle error - user cannot click on toggle button if he can't change collateral(if his health factor goes under 1)
    } finally {
      setSelectedCollateralAsset(null)
    }
  }

  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { symbol, icon } }: any) => (
        <ColumnLayout>
          <Icon name={icon} size={25} />
          <TruncatedText>
            <Text type="heading 3" as="span">
              {symbol}
            </Text>
          </TruncatedText>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { currentATokenBalance } }) => (
        <TruncatedText>
          <Text type="body 3" as="span">
            <FormattedNumber value={currentATokenBalance} />
          </Text>
        </TruncatedText>
      ),
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { supplyAPY } }) => (
        <FormattedNumber value={supplyAPY} percent />
      ),
      alignText: 'left',
      width: 100,
    },

    collateral: {
      header: 'Collateral',
      Cell: ({ data: { usageAsCollateralEnabledOnUser, underlyingAsset } }) => {
        if (selectedCollateralAsset === underlyingAsset) {
          return <>loading...</>
        } else {
          return (
            <Toggle
              checked={usageAsCollateralEnabledOnUser}
              onClick={() =>
                void toggleCollateral(
                  underlyingAsset,
                  usageAsCollateralEnabledOnUser,
                )
              }
            />
          )
        }
      },
      alignText: 'center',
      width: 120,
    },
    action: {
      header: '',
      Cell: ({ data: { balance, symbol, underlyingAsset } }) => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          className="u-full-width"
          onClick={() =>
            openModal({
              balance,
              symbol,
              underlyingAsset,
            })
          }
        >
          Withdraw
        </Button>
      ),
      width: 160,
    },
  } as Record<string, ColumnData<UserReserveData>>

  return (
    <>
      <Table
        columns={columns}
        data={userReservesWithDept}
        noDataMessage="Nothing deposited yet"
        titleComponent={
          <DepositTitleBox isEmpty={userReservesWithDept.length === 0} />
        }
        footer={<BoxLayout gap={1} />}
      />
      <WithdrawModal
        isOpen={!!modalData}
        onClose={closeModal}
        reserveData={modalData}
        healthFactor={healthFactor}
      />
    </>
  )
}
