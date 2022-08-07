import { ColumnLayout, StackLayout, Text } from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { FormattedNumber } from '../FormattedNumber'

interface Props {
  isEmpty: boolean
  totalSupplyBalance?: number
  totalCollateral?: number
}

export const DepositTitleBox: FunctionComponent<Props> = ({
  isEmpty,
  totalSupplyBalance,
  totalCollateral,
}: Props) => (
  <StackLayout gap={2.125}>
    <Text as="span" color="oxfordBlue" type="heading 2">
      Your deposit
    </Text>
    {!isEmpty && (
      <ColumnLayout center gap={1}>
        <Text color="oxfordBlue" as="span" type="body 2">
          Balance $
          <Text as="span" color="oxfordBlue" bold>
            <FormattedNumber value={totalSupplyBalance} />
          </Text>
        </Text>

        <Text color="oxfordBlue" as="span" type="body 2">
          Collateral $
          <Text as="span" color="oxfordBlue" bold>
            <FormattedNumber value={totalCollateral} />
          </Text>
        </Text>
      </ColumnLayout>
    )}
  </StackLayout>
)
