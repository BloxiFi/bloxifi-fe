import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

interface Props {
  element: JSX.Element
  children: any
  tooltipId?: string
  multiline?: boolean
  width?: number
  effect?: 'float' | 'solid'
  position?: 'top' | 'right' | 'bottom' | 'left'
  tooltipText?: string
  icon?: string
}

export const Tooltip = ({ effect = 'float', ...props }: Props) => {
  const id = props.tooltipId || Math.random() * 100

  return (
    <>
      <Content
        data-effect={effect}
        data-place={props.position}
        data-for={`${id}`}
        data-tip={props.tooltipText}
      >
        {props.element}
      </Content>
      <StyledTooltip data-element="tooltip" width={props.width} id={`${id}`}>
        {props.children}
      </StyledTooltip>
    </>
  )
}

const Content = styled.span`
  .u-text-truncated {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    max-width: 100%;
    display: block;
  }
`

const StyledTooltip = styled(ReactTooltip)<{ width: number }>`
  padding: 1rem 0.625rem !important;

  &.type-dark.__react_component_tooltip {
    box-shadow: ${({ theme }) => theme.tooltipShadow};
    background-color: ${({ theme }) => theme.white};
    border-radius: 4px;
    color: ${({ theme }) => theme.textColorDark};
    text-transform: none;
    ${props => {
      return props.width ? `max-width: ${props.width}px;` : ''
    }}
    &.place-top {
      &::after {
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.white};
        transform: rotate(45deg);
        z-index: -100;
        border-top: 1px solid transparent;
        border-left: 1px solid transparent;
        border-right: 1px solid ${({ theme }) => theme.borderColor};
        border-bottom: 1px solid ${({ theme }) => theme.borderColor};
      }

      &::before {
        bottom: -1px;
        background: ${({ theme }) => theme.white};
        z-index: -1;
      }
    }

    &.show {
      opacity: 1;
    }

    &.place-bottom {
      &::after {
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.white};
        transform: rotate(45deg);
        z-index: -100;
        border: 1px solid ${({ theme }) => theme.borderColor};
      }

      &::before {
        left: 50%;
        margin-left: -10px;
        top: -1px;
        background: ${({ theme }) => theme.white};
        width: 16px;
        height: 12px;
        z-index: -1;
      }
    }

    &.place-right,
    &.place-left {
      &::after {
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.white};
        transform: rotate(45deg);
        border: 1px solid ${({ theme }) => theme.borderColor};
        margin-top: -6px;
        z-index: -100;
      }

      &::before {
        margin-top: -8px;
        top: 50%;
        background: ${({ theme }) => theme.white};
        width: 10px;
        height: 16px;
        z-index: -1;
      }
    }

    &.place-right {
      &::before {
        margin-left: 7px;
      }
    }

    &.place-left {
      &::before {
        margin-right: 7px;
      }
    }
  }
`
