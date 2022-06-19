import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = {
  isSelected: boolean
  disabled?: boolean
} & HTMLAttributes<HTMLOrSVGElement>

export const AssetListItem: FunctionComponent<Props> = ({
  isSelected,
  onClick,
  children,
  className,
  disabled = false,
}: Props) => (
  <Item
    className={className}
    disabled={disabled}
    isSelected={isSelected}
    onClick={onClick}
  >
    {children}
  </Item>
)

const Item = styled.span<Props>`
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? 'green' : 'black')};
  ${({ disabled }) =>
    disabled &&
    ` 
    pointer-events:none;
    color: gray;
  `}
`
