import React, { forwardRef, FunctionComponent, HTMLProps } from 'react'
import styled from 'styled-components'

import { Fonts } from './styles/fonts'

type Status = 'error' | 'success'
/**
 * BaseInput props.
 */
export interface Props extends HTMLProps<HTMLInputElement> {
  /**
   * Status error or success will paint input border and info text to red or green respectively
   */
  status?: Status
  /**
   * Input info that will appear below the input field
   */
  info?: string
}

export const BaseInput: FunctionComponent<Props> = forwardRef(
  (
    {
      type = 'text',
      className = '',
      disabled = false,
      info = '',
      status,
      ...props
    }: Props,
    ref,
  ) => {
    return (
      <Wrapper>
        <InnerWrapper className={className} status={status}>
          <input ref={ref} type={type} {...props} disabled={disabled} />
        </InnerWrapper>

        {info && <Info status={status}>{info}</Info>}
      </Wrapper>
    )
  },
)

const Wrapper = styled.div`
  width: 100%;
`

const InnerWrapper = styled.div<{ status?: Status }>`
  input {
    width: calc(100% - 1.125rem * 2);
    height: 1.875rem;
    background: ${({ theme }) => theme.inputBackground};
    border: none;
    box-shadow: ${({ theme, status }) =>
      `0 0 0 1px ${theme[status] ?? theme.inputBorder}`};
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    line-height: 19px;
    font-weight: 600;
    padding: 0 1.125rem;
    font-family: ${Fonts.Inter};
    color: ${({ theme }) => theme.inputTextColor};

    &:hover {
      background-color: ${({ theme }) => theme.inputHoverBackground};
    }

    &:active {
      background-color: ${({ theme }) => theme.inputBackground};
    }

    &:active,
    &:focus {
      box-shadow: ${({ theme, status }) =>
        `0 0 0 2px ${theme[status] ?? theme.inputBorder}`};
    }

    &[type='number'] {
      appearance: textfield;
    }

    &[disabled] {
      opacity: 0.5;
    }
  }
`

const Info = styled.span<{ status?: Status }>`
  max-width: 100%;
  padding: 0 1.125rem;
  font-weight: 400;
  font-size: 0.75rem;
  font-family: ${Fonts.Inter};
  line-height: 15px;
  color: ${({ status, theme }) => {
    return theme[status] ?? theme.inputBorder
  }};
`
