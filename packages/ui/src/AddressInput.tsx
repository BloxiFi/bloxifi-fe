import React, { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'

import { BaseInputProps, InnerWrapper } from './BaseInput'
import { Icon, IconProps } from './Icon'
import { ColumnLayout } from './Layouts'
import { Text } from './Text'

interface Props {
  icon: IconProps
  networkName: string
  error?: string
}

type AddressInputProps = Omit<BaseInputProps, 'info'> & Props

export const AddressInput = forwardRef(
  (
    {
      className = '',
      disabled = true,
      status,
      height = 'large',
      icon,
      networkName,
      value,
      type = 'text',
      error,
      ...props
    }: AddressInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Wrapper>
        <InnerWrapper className={className} status={status} height={height}>
          <input
            ref={ref}
            type={type}
            {...props}
            disabled={disabled}
            value={value}
          />

          <InputIcon center align="space-between">
            {status === 'error' && error ? (
              <Text as="span" type="body 3" color="red">
                {error}
              </Text>
            ) : (
              <>
                <ColumnLayout gap={1} center>
                  {icon && <Icon name={icon.name} size={icon.size} />}
                  <Text as="span" type="body 3">
                    {networkName}
                  </Text>
                </ColumnLayout>
                <Text as="span" type="body 2">
                  {value}
                </Text>
              </>
            )}
          </InputIcon>
        </InnerWrapper>
      </Wrapper>
    )
  },
)

const Wrapper = styled.div`
  position: relative;

  input {
    color: transparent;
  }
`

const InputIcon = styled(ColumnLayout)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 1.125rem;
  width: 100%;
`
