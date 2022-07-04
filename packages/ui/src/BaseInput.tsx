import classNames from 'classnames'
import React, { forwardRef, FunctionComponent, HTMLProps } from 'react'
import styled from 'styled-components'

import { Fonts } from './styles/fonts'

/**
 * BaseInput props.
 */
export interface Props extends HTMLProps<HTMLInputElement> {
  /**
   * Status error or success will paint input border and info text to red or green respectively
   */
  status?: 'success' | 'error' | undefined
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
      ...props
    }: Props,
    ref,
  ) => {
    return (
      <Wrapper>
        <InnerWrapper
          className={classNames(
            className && className,
            disabled && 'disabled',
            props.status && props.status,
          )}
        >
          <input
            ref={ref}
            type={type}
            {...props}
            disabled={disabled}
            value={props.value}
          />
        </InnerWrapper>

        {info && <Info status={props.status}>{info}</Info>}
      </Wrapper>
    )
  },
)

const Wrapper = styled.div`
  width: 100%;
`

const InnerWrapper = styled.div`
  input {
    width: calc(100% - 1.125rem * 2);
    height: 1.875rem;
    background: ${({ theme }) => theme.inputBackground};
    border: 1px solid ${({ theme }) => theme.inputBorder};
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    line-height: 19.36px;
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
      border-width: 2px;
    }

    &[type='number'] {
      appearance: textfield;
    }
  }

  &.error {
    input {
      border-color: ${({ theme }) => theme.error};
    }
  }

  &.success {
    input {
      border-color: ${({ theme }) => theme.success};
    }
  }

  &.disabled {
    opacity: 0.5;
  }
`

const Info = styled.span<{ status?: 'error' | 'success' | undefined }>`
  max-width: 100%;
  padding: 0 1.125rem;
  font-weight: 400;
  font-size: 0.75rem;
  font-family: ${Fonts.Inter};
  line-height: 15px;
  color: ${({ status, theme }) => {
    return status
      ? status === 'error'
        ? theme.error
        : theme.success
      : theme.inputBorder
  }};
`
