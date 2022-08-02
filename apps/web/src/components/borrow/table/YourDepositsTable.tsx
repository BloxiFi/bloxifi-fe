import {
  BoxLayout,
  Button,
  ColumnData,
  ColumnLayout,
  Icon,
  Table,
  Text,
  Toggle,
} from '@bloxifi/ui'
import React, { FunctionComponent, useState } from 'react'
import { BorrowAndLending } from '@bloxifi/core'

import { FormattedNumber } from '../FormattedNumber'

import { DepositTitleBox } from './DepositTitleBox'

import { UserReserveData, WalletContainer } from '@/containers/WalletContainer'
import { Web3Container } from '@/containers/Web3Container'

export const YourDepositsTable: FunctionComponent = () => {
  const {
    state: { userReserves },
  } = WalletContainer.useContainer()
  const {
    state: { provider },
  } = Web3Container.useContainer()
  const signer = provider.getSigner()
  const [selectedCollateralAsset, setSelectedCollateralAsset] =
    useState<string>()
  const formatedData = userReserves.filter(
    (reserve: UserReserveData) => reserve.currentATokenBalance !== 0,
  )

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
          <Icon name={icon} size={40} />
          <Text type="heading 3" as="span">
            {symbol}
          </Text>
        </ColumnLayout>
      ),
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { currentATokenBalance } }) => (
        <Text type="body 3" as="span">
          <FormattedNumber value={currentATokenBalance} />
        </Text>
      ),
      alignText: 'left',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { supplyAPY } }) => (
        <FormattedNumber value={supplyAPY} percent />
      ),
      alignText: 'left',
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
              onClick={() => {
                setSelectedCollateralAsset(underlyingAsset)
                void toggleCollateral(
                  underlyingAsset,
                  usageAsCollateralEnabledOnUser,
                )
              }}
            />
          )
        }
      },
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: () => (
        <Button
          appearance="secondary"
          variant="thin"
          size="small"
          className="u-full-width"
        >
          Withdraw
        </Button>
      ),
      width: 160,
    },
  } as Record<string, ColumnData<UserReserveData>>

  return (
    <Table
      columns={columns}
      data={formatedData}
      noDataMessage="Nothing deposited yet"
      titleComponent={<DepositTitleBox isEmpty={formatedData.length === 0} />}
      footer={<BoxLayout gap={1} />}
    />
  )
}
