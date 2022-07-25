import React, { FunctionComponent, useState } from 'react'
import { Button, ColumnData, Table } from '@bloxifi/ui'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'

import { DepositModal } from '../modal/DepositModal'

import { WalletBalance, WalletContainer } from '@/containers/WalletContainer'

export const AvaliableToDepositTable: FunctionComponent = () => {
  const {
    state: { reserves },
  } = WalletContainer.useContainer()
  const [modalData, setModalData] = useState<WalletBalance>()

  const openModal = (data: WalletBalance) => {
    setModalData(data)
  }

  const closeModal = () => {
    setModalData(undefined)
    //TODO update balance
  }

  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { name, icon, fullName } }) => (
        <AssetName symbol={name} icon={icon} fullName={fullName} />
      ),
      alignText: 'left',
    },
    walletBalance: {
      header: 'Wallet balance',
      Cell: ({ data: { balance } }) => {
        return <FormattedNumber value={parseFloat(balance)} />
      },
      alignText: 'center',
    },
    APY: {
      header: 'APY',
      Cell: ({ data: { supplyAPY } }) => (
        <FormattedNumber value={supplyAPY} percent />
      ),
      alignText: 'center',
    },
    action: {
      header: '',
      Cell: ({ data }) => (
        <Button
          disabled={!data.balance}
          appearance="secondary"
          variant="medium"
          size="small"
          onClick={() => openModal(data)}
        >
          Deposit
        </Button>
      ),
      width: 100,
    },
  } as Record<string, ColumnData<WalletBalance>>

  return (
    <>
      <Table
        columns={columns}
        data={reserves}
        titleComponent="Assets to deposit"
        columnSpacing
      />
      {!!modalData && (
        <DepositModal
          isOpen={!!modalData}
          onClose={closeModal}
          reserveData={modalData}
        />
      )}
    </>
  )
}
