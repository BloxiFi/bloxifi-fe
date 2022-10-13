import {
  Icon,
  ColumnLayout,
  StackLayout,
  Text,
  IconNamesType,
  TruncatedText,
} from '@bloxifi/ui'
import { TokenList } from 'packages/core/src'
import React, { FunctionComponent } from 'react'

interface Props {
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
  readonly fullName?: string
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
    <StackLayout as={TruncatedText}>
      {fullName && (
        <Text
          data-cy={`assetFullName-${symbol}`}
          type="heading 3"
          as={TruncatedText}
        >
          {fullName}
        </Text>
      )}
      <Text
        data-cy={`assetName-${symbol}`}
        type={fullName ? 'body 1' : 'heading 3'}
        as={TruncatedText}
      >
        {symbol}
      </Text>
    </StackLayout>
  </ColumnLayout>
)
