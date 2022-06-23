import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'

import { getActiveComponent } from './ButtonVariants'

export const ButtonAppearance = [
  'primary',
  'primary-ghost',
  'secondary',
  'dark',
] as const
export const ButtonSize = ['small', 'medium', 'large'] as const
export const ButtonVariant = ['thin', 'medium', 'large'] as const
export type ButtonAppearance = typeof ButtonAppearance[number]
export type ButtonSize = typeof ButtonSize[number]
export type ButtonVariant = typeof ButtonVariant[number]

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant. Affects padding, font size and height
   */
  variant: ButtonVariant
  /**
   * Button size. Affects button width
   */
  size: ButtonSize
  /**
   * Button appearance. Affetcs button colors
   */
  appearance: ButtonAppearance
  /**
   * Button disabled
   */
  disabled?: boolean
}

export const Button: FunctionComponent<ButtonProps> = ({
  appearance,
  variant,
  size,
  ...props
}) => {
  const ActiveComponent = getActiveComponent(appearance)

  return (
    <>
      <ActiveComponent
        variant={variant}
        size={size}
        appearance={appearance}
        {...props}
      >
        {props.children}
      </ActiveComponent>
    </>
  )
}
