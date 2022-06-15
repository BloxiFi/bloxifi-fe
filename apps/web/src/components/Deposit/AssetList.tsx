import { BoxLayout, StackLayout } from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { AssetListItem } from './AssetListItem'

import { DepositContainer } from '@/containers/DepositContainer'
import TOKENS from '@bloxifi/core/src/contracts/tokens/tokens.json'

const AssetList = () => {
  const {
    dispatch,
    state: { selectedAsset },
  } = DepositContainer.useContainer()
  const { t } = useTranslation()
  const AVAILABLE_TOKENS = Object.keys(TOKENS)

  return (
    <BoxLayout>
      <h3>{t('deposit.assetsToDeposit')}</h3>
      <StackLayout>
        {AVAILABLE_TOKENS.map(asset => (
          <AssetListItem
            key={asset}
            isSelected={selectedAsset === asset}
            disabled={!TOKENS[asset]}
            onClick={() =>
              dispatch({
                type: 'setSelectedAsset',
                value: { asset, address: TOKENS[asset] },
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
