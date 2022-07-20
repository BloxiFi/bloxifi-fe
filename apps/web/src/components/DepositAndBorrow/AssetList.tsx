import { getAllAssets } from '@bloxifi/core'
import { BoxLayout, StackLayout } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { AssetListItem } from './AssetListItem'

import { DepositContainer } from '@/containers/DepositContainer'

const AssetList = () => {
  const {
    dispatch,
    state: { selectedAsset },
  } = DepositContainer.useContainer()
  const { t } = useTranslation()
  const allAssets = getAllAssets()

  return (
    <BoxLayout>
      <h3>{t('deposit.assetsToDeposit')}</h3>
      <StackLayout>
        {allAssets.map(([asset, address]) => (
          <AssetListItem
            key={asset}
            isSelected={selectedAsset === asset}
            disabled={!address}
            onClick={() =>
              dispatch({
                type: 'setSelectedAsset',
                value: { asset, address },
              })
            }
          >
            {asset}
          </AssetListItem>
        ))}
      </StackLayout>
    </BoxLayout>
  )
}
export default AssetList
