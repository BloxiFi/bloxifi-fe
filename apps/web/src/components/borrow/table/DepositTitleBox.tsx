import {
  ColumnLayout,
  ContentLoader,
  StackLayout,
  Text,
  Tooltip,
} from '@bloxifi/ui'
import { useTranslation } from 'react-i18next'
import React, { FunctionComponent } from 'react'

import { FormattedNumber } from '../FormattedNumber'

interface Props {
  isEmpty: boolean
  isLoading?: boolean
  totalSupplyBalance?: number
  totalCollateral?: number
}

export const DepositTitleBox: FunctionComponent<Props> = ({
  isEmpty,
  isLoading,
  totalSupplyBalance,
  totalCollateral,
}: Props) => {
  const { t } = useTranslation()
  return (
    <StackLayout gap={2.125}>
      <Text as="span" color="oxfordBlue" type="heading 2">
        Your deposit
      </Text>
      {isLoading ? (
        <ContentLoader width="100%" />
      ) : (
        !isEmpty && (
          <ColumnLayout center gap={1}>
            <Tooltip
              element={
                <ColumnLayout gap={0.5}>
                  <Text
                    color="oxfordBlue"
                    as="span"
                    type="body 2"
                    data-cy="depositedBalance"
                  >
                    Balance
                  </Text>
                  <Text
                    as="span"
                    color="oxfordBlue"
                    bold
                    data-cy="depositedBalanceUSD"
                  >
                    <FormattedNumber
                      value={totalSupplyBalance}
                      symbol="USD"
                      symbolPosition="before"
                    />
                  </Text>
                </ColumnLayout>
              }
            >
              <Text color="oxfordBlue" type="small-text">
                {t('global.tooltips.depositedBalance')}
              </Text>
            </Tooltip>
            <Tooltip
              element={
                <ColumnLayout gap={0.5}>
                  <Text
                    color="oxfordBlue"
                    as="span"
                    type="body 2"
                    data-cy="collateralBalance"
                  >
                    Collateral
                  </Text>
                  <Text
                    as="span"
                    color="oxfordBlue"
                    bold
                    data-cy="collateralBalanceUSD"
                  >
                    <FormattedNumber
                      value={totalCollateral}
                      symbol="USD"
                      symbolPosition="before"
                    />
                  </Text>
                </ColumnLayout>
              }
            >
              <Text color="oxfordBlue" type="small-text">
                {t('global.tooltips.totalCollateral')}
              </Text>
            </Tooltip>
          </ColumnLayout>
        )
      )}
    </StackLayout>
  )
}
