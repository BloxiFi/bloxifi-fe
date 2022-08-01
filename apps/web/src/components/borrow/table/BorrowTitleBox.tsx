import {
  ColumnLayout,
  ProgressBar,
  StackLayout,
  stylings,
  Text,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { FormattedNumber } from '../FormattedNumber'

interface Props {
  isEmpty: boolean
  totalBorrowBalance?: number
  currentBorrowedValue?: number
}

export const BorrowTitleBox: FunctionComponent<Props> = ({
  isEmpty,
  totalBorrowBalance,
  currentBorrowedValue = 0,
}: Props) => (
  <ColumnLayout className={stylings.tableHeaderWithProgressBar}>
    <StackLayout gap={2.125}>
      <Text as="span" color="oxfordBlue" type="heading 2">
        Your borrow
      </Text>
      {!isEmpty && (
        <Text color="oxfordBlue" type="body 2" as="span">
          Balance $
          <Text as="span" color="oxfordBlue" bold>
            <FormattedNumber value={totalBorrowBalance} />
          </Text>
        </Text>
      )}
    </StackLayout>
    {!isEmpty && (
      <ProgressBar
        className={stylings.tableHeaderProgressBar}
        title="Borrowed"
        value={78}
        showBottomLabel
      />
    )}
  </ColumnLayout>
)
