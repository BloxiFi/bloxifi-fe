import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = {
  isSelected: boolean
} & HTMLAttributes<HTMLOrSVGElement>

export const AssetListItem: FunctionComponent<Props> = ({
  isSelected,
  onClick,
  children,
  className,
}: Props) => (
  <Item className={className} isSelected={isSelected} onClick={onClick}>
    {children}
  </Item>
)

const Item = styled.span<Props>`
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? 'green' : 'black')};
`
