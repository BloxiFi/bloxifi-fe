import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'

import { getActiveComponent } from './ButtonVariants'

export const ButtonAppereance = [
  'primary',
  'primary-ghost',
  'secondary',
  'dark',
] as const
export const ButtonSize = ['small', 'medium', 'large'] as const
export const ButtonVariant = ['thin', 'medium', 'large'] as const
export type ButtonAppereance = typeof ButtonAppereance[number]
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
   * Button appereance. Affetcs button colors
   */
  appereance: ButtonAppereance
  /**
   * Button disabled
   */
  disabled?: boolean
}

export const Button: FunctionComponent<ButtonProps> = ({
  appereance,
  variant,
  size,
  ...props
}) => {
  const ActiveComponent = getActiveComponent(appereance)

  return (
    <>
      <ActiveComponent
        variant={variant}
        size={size}
        appereance={appereance}
        {...props}
      >
        {props.children}
      </ActiveComponent>
    </>
  )
}
