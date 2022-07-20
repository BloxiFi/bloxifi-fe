import {
  ColumnLayout,
  ProgressBar,
  StackLayout,
  stylings,
  Text,
} from '@bloxifi/ui'
import React, { FunctionComponent } from 'react'

type Props = {
  isEmpty: boolean
}

export const BorrowTitleBox: FunctionComponent<Props> = ({
  isEmpty,
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
            1.00
          </Text>
        </Text>
      )}
    </StackLayout>
    {!isEmpty && (
      <ProgressBar
        className={stylings.tableHeaderProgressBar}
        title="Borrowed"
        value={50}
        showBottomLabel
      />
    )}
  </ColumnLayout>
)
