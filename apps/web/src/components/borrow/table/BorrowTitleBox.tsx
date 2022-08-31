import {
  ColumnLayout,
  ContentLoader,
  ProgressBar,
  StackLayout,
  stylings,
  Text,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

import { FormattedNumber } from '../FormattedNumber'

interface Props {
  isEmpty: boolean
  isLoading?: boolean
  totalBorrowBalance?: number
  currentBorrowedValue?: number
}

export const BorrowTitleBox: FunctionComponent<Props> = ({
  isEmpty,
  isLoading,
  totalBorrowBalance,
  currentBorrowedValue = 0,
}: Props) => (
  <StackLayout gap={2.125}>
    <Text as="span" color="oxfordBlue" type="heading 2">
      Your borrow
    </Text>

    {isLoading ? (
      <ContentLoader width="100%" />
    ) : (
      !isEmpty && (
        <ColumnLayout className={stylings.tableHeaderWithProgressBar}>
          <ColumnLayout gap={0.5}>
            <Text color="oxfordBlue" type="body 2" as="span">
              Balance
            </Text>
            <Text as="span" color="oxfordBlue" bold>
              <FormattedNumber
                value={totalBorrowBalance}
                symbol="USD"
                symbolPosition="before"
              />
            </Text>
          </ColumnLayout>
          <ProgressBar
            className={stylings.tableHeaderProgressBar}
            title="Borrowed"
            value={currentBorrowedValue}
            showBottomLabel
          />
        </ColumnLayout>
      )
    )}
  </StackLayout>
)
