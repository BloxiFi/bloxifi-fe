import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { ButtonAppereance, ButtonProps, ButtonVariant } from './Button'
import { Colors } from './styles/colors'
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
    border: 0;
  }
`
const ButtonPrimary = styled(ButtonBase)`
  color: ${Colors.white};
  background-color: ${Colors.buttonPrimary};

  &:hover {
    background-color: ${Colors.buttonPrimaryHover};
  }

  &:disabled {
    background-color: ${Colors.buttonLight};
  }
`
const ButtonSecondary = styled(ButtonBase)`
  color: ${Colors.buttonDark};
  background-color: ${Colors.white};
  border: 1px solid ${Colors.buttonDark};

  &:hover {
    background: ${Colors.buttonLight};
  }

  &:disabled {
    color: ${Colors.buttonLight};
    background-color: ${Colors.white};
    border: 1px solid ${Colors.buttonLight};
  }
`
const ButtonDark = styled(ButtonBase)`
  color: ${Colors.white};
  background-color: ${Colors.buttonDark};

  &:hover {
    background: linear-gradient(
      270deg,
      ${Colors.buttonGradient1} -0.16%,
      ${Colors.buttonGradient2} 100%
    );
  }

  &:disabled {
    color: ${Colors.white};
    background-color: ${Colors.buttonLight};
  }
`
const ButtonPrimaryGhost = styled(ButtonBase)`
  color: ${Colors.white};
  background-color: ${Colors.buttonPrimaryGhost};
  border: 1px solid ${Colors.white};

  &:hover {
    background: linear-gradient(
      270deg,
      ${Colors.buttonGradient1} -0.16%,
      ${Colors.buttonGradient2} 100%
    );
    border: 1px solid ${Colors.white};
  }

  &:disabled {
    color: ${Colors.buttonLight};
    border: 1px solid ${Colors.buttonLight};
  }
`

export const getActiveComponent = (appereance: ButtonAppereance) => {
  switch (appereance) {
    case 'primary':
      return ButtonPrimary
    case 'primary-ghost':
      return ButtonPrimaryGhost
    case 'secondary':
      return ButtonSecondary
    case 'dark':
      return ButtonDark
    default:
      return ButtonPrimary
  }
}
