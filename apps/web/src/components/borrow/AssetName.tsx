import {
  Icon,
  ColumnLayout,
  StackLayout,
  Text,
  IconNamesType,
} from '@bloxifi/ui'
import { TokenList } from 'packages/core/src'
import React, { FunctionComponent } from 'react'

type Props = {
  /**
   * Represents the asset icon
   * */
  readonly icon: IconNamesType
  /**
   * Represents the asset symbol
   * */
  readonly symbol: TokenList
  /**
   * Represents the asset full name
   * */
  readonly fullName: string
  /**
   * Represents width and height of icon. Defaults to 40px
   * */
  readonly iconSize?: number
}

export const AssetName: FunctionComponent<Props> = ({
  icon,
  fullName,
  symbol,
  iconSize = 40,
}: Props) => (
  <ColumnLayout>
    <Icon name={icon} size={iconSize} />
    <StackLayout>
      <Text type="heading 3" as="span">
        {fullName}
      </Text>
      <Text type="body 1" as="span">
        {symbol}
      </Text>
    </StackLayout>
  </ColumnLayout>
)
