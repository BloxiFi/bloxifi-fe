import { ColumnLayout, StackLayout, Text } from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

interface Props {
  isEmpty: boolean
}

export const DepositTitleBox: FunctionComponent<Props> = ({
  isEmpty,
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
            1.00
          </Text>
        </Text>

        <Text color="oxfordBlue" as="span" type="body 2">
          Collateral $
          <Text as="span" color="oxfordBlue" bold>
            1.00
          </Text>
        </Text>
      </ColumnLayout>
    )}
  </StackLayout>
)
