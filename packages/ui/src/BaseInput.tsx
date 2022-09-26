import React, { ForwardedRef, forwardRef, HTMLProps } from 'react'
import styled from 'styled-components'

import { Fonts } from './styles/fonts'

type Status = 'error' | 'success'
type Height = 'thin' | 'large'
/**
 * BaseInput props.
 */
export interface BaseInputProps extends HTMLProps<HTMLInputElement> {
  /**
   * Status error or success will paint input border and info text to red or green respectively
   */
  status?: Status
  /**
   * Input info that will appear below the input field
   */
  info?: string
  /**
   * Input field height
   */
  height?: Height
}

export const BaseInput = forwardRef(
  (
    {
      type = 'text',
      className = '',
      disabled = false,
      info = '',
      status,
      height = 'thin',
      ...props
    }: BaseInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Wrapper>
        <InnerWrapper className={className} status={status} height={height}>
          <input ref={ref} type={type} {...props} disabled={disabled} />
        </InnerWrapper>

        <Info status={status}>{info}</Info>
      </Wrapper>
    )
  },
)
const Wrapper = styled.span`
  position: relative;
`
export const InnerWrapper = styled.div<{ status?: Status; height?: Height }>`
  input {
    width: 100%;
    height: ${({ height }) => (height === 'thin' ? '1.875rem' : '3.125rem')};
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
    transition: box-shadow 0.3s;

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

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
      }
    }

    &[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
  }
`

const Info = styled.span<{ status?: Status }>`
  max-width: 100%;
  position: absolute;
  bottom: -1rem;
  padding: 0 1.125rem;
  font-weight: 400;
  font-size: 0.75rem;
  font-family: ${Fonts.Inter};
  line-height: 15px;
  color: ${({ status, theme }) => {
    return theme[status] ?? theme.inputBorder
  }};
`
