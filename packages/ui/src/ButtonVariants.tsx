import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { ButtonAppearance, ButtonProps, ButtonVariant } from './Button'
import { Fonts } from './styles/fonts'
import { FitContentWidth, FullWidth } from './styles/mixins'

export const Sizing = {
  height: {
    large: 50,
    medium: 40,
    thin: 30,
  },
  width: {
    large: 259,
    medium: 192,
    small: 120,
  },
}

export const getPadding = (variant: ButtonVariant) => {
  switch (variant) {
    case 'large':
      return '10px 13.85px'
    case 'medium':
      return '8px 7px'
    case 'thin':
      return '6px 9.44px'
    default:
      return '8px 7px'
  }
}

export const getFontSize = (variant: ButtonVariant) => {
  switch (variant) {
    case 'large':
      return 1
    case 'medium':
    case 'thin':
      return 0.875
    default:
      return 0.875
  }
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return (
      <button ref={ref} data-element="button" {...props}>
        {props.children}
      </button>
    )
  },
)

export const ButtonBase = styled(ButtonComponent)`
  position: relative;
  font-family: ${Fonts.ClashDisplay};
  height: ${({ variant }) => Sizing.height[variant]}px;
  width: ${({ size }) => Sizing.width[size]}px;
  ${({ className }) => FullWidth({ className })};
  ${({ className }) => FitContentWidth({ className })};
  padding: ${({ variant }) => getPadding(variant)};
  font-size: ${({ variant }) => getFontSize(variant)}rem;
  transition: background 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.315rem;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.5rem;

  &[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
`
const ButtonPrimary = styled(ButtonBase)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.buttonPrimary};

  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimaryHover};
  }
`
const ButtonSecondary = styled(ButtonBase)`
  color: ${({ theme }) => theme.buttonDark};
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.buttonDark};

  &:hover {
    background: ${({ theme }) => theme.buttonLight};
  }
`
const ButtonDark = styled(ButtonBase)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.buttonDark};

  &:hover {
    background: linear-gradient(
      270deg,
      ${({ theme }) => theme.buttonGradient1} -0.16%,
      ${({ theme }) => theme.buttonGradient2} 100%
    );
  }
`
const ButtonPrimaryGhost = styled(ButtonBase)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.buttonPrimaryGhost};
  border: 1px solid ${({ theme }) => theme.white};

  &:hover {
    background: linear-gradient(
      270deg,
      ${({ theme }) => theme.buttonGradient1} -0.16%,
      ${({ theme }) => theme.buttonGradient2} 100%
    );
    border: 1px solid ${({ theme }) => theme.white};
  }
`
const ButtonGradient = styled(ButtonBase)`
  color: ${({ theme }) => theme.white};
  background: linear-gradient(
    270deg,
    ${({ theme }) => theme.buttonGradient1} -0.16%,
    ${({ theme }) => theme.buttonGradient2} 100%
  );

  &:hover {
    background: ${({ theme }) => theme.buttonDark};
  }
`

export const getActiveComponent = (appearance: ButtonAppearance) => {
  switch (appearance) {
    case 'primary':
      return ButtonPrimary
    case 'primary-ghost':
      return ButtonPrimaryGhost
    case 'secondary':
      return ButtonSecondary
    case 'dark':
      return ButtonDark
    case 'gradient':
      return ButtonGradient
    default:
      return ButtonPrimary
  }
}
