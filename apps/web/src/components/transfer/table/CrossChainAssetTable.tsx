import { BoxLayout, ColumnData, Table, TruncatedText } from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { AssetName } from '../../borrow/AssetName'

export const CrossChainAssetTable: FunctionComponent = () => {
  const assetsList = [
    {
      icon: 'metamask',
      name: 'Moonbeam GLMR',
      symbol: 'GLMR',
      currentAssets: 1000,
    },
    {
      icon: 'polkadot',
      name: 'Acala ACA',
      symbol: 'aACA',
      currentAssets: 10,
    },
    {
      icon: 'metamask',
      name: 'Acala AUSD',
      symbol: 'aUSD',
      currentAssets: 0,
    },
    {
      icon: 'polkadot',
      name: 'Parallel PARA',
      symbol: 'cPARA',
      currentAssets: 0,
    },
    {
      icon: 'polkadot',
      name: 'Polkadot DOT',
      symbol: 'cDOT',
      currentAssets: 0,
    },
  ]
  const columns = {
    assets: {
      header: 'Assets',
      Cell: ({ data: { icon, fullName, symbol } }: any) => (
        <AssetName
          fullName={fullName}
          icon={icon}
          symbol={symbol}
          iconSize={25}
        />
      ),
      alignText: 'left',
    },
    balance: {
      header: 'Balance',
      Cell: ({ data: { currentAssets, symbol } }) => (
        <TruncatedText>
          {currentAssets}x{symbol}
        </TruncatedText>
      ),
      alignText: 'right',
    },
  } as Record<string, ColumnData>

  return (
    <>
      <Table
        columns={columns}
        data={assetsList}
        noDataMessage="No data to show"
        titleComponent="Cross Chain Assets"
        footer={<BoxLayout gap={1} />}
        isLoading={false}
      />
    </>
  )
}
