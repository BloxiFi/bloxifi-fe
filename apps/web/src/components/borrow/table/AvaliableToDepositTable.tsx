import React, { FunctionComponent, useState } from 'react'
import { Button, ColumnData, Table } from '@bloxifi/ui'

import { AssetName } from '../AssetName'
import { FormattedNumber } from '../FormattedNumber'

import { DepositModal } from './DepositModal'

import { WalletBalance, WalletContainer } from '@/containers/WalletContainer'

export const AvaliableToDepositTable: FunctionComponent = () => {
  const {
    state: { reserves },
  } = WalletContainer.useContainer()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedAssetData, setSelectedAssetData] = useState<WalletBalance>()

  const openModal = (data: WalletBalance) => {
    setIsOpen(true)
    setSelectedAssetData(data)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedAssetData(undefined)
    //TODO update balance
  }

  const columns = {
    assets: {
      header: 'Assets',
      //TODO@Kiki I changed symbol to "name" because that was the appropriate type (but not sure that this is correct) please check this.
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
      {selectedAssetData && (
        <DepositModal
          isOpen={isOpen}
          onClose={closeModal}
          data={selectedAssetData}
        />
      )}
    </>
  )
}
