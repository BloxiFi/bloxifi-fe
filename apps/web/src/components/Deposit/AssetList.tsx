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

  const depositAssetsList: string[] = [
    'WETH',
    'LINK',
    'DOT',
    'WBTC',
    'DAI',
    'USDC',
    'GLMR',
    'aUSD',
    'ACA',
  ]
  return (
    <BoxLayout>
      <h3>{t('deposit.assetsToDeposit')}</h3>
      <StackLayout>
        {depositAssetsList.map(asset => (
          <AssetListItem
            key={asset}
            isSelected={selectedAsset === asset}
            onClick={() => dispatch({ type: 'setSelectedAsset', value: asset })}
          >
            {asset}
          </AssetListItem>
        ))}
      </StackLayout>
    </BoxLayout>
  )
}
export default AssetList
