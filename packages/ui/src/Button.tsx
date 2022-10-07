import React, {
  ButtonHTMLAttributes,
  FunctionComponent,
  useContext,
} from 'react'
import { ThemeContext } from 'styled-components'

import { getActiveComponent, IconSizing, getColor } from './ButtonVariants'
import { Icon, IconNamesType } from './Icon'

export const ButtonAppearance = [
  'primary',
  'primary-ghost',
  'secondary',
  'dark',
  'gradient',
  'text',
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
  /**
   * Icon
   */
  icon?: IconNamesType
  /**
   * This represents custom icon/text color related to Text button
   */
  color?: string
  /**
   * Represents the button border radius
   */
  radius?: 'rounded' | 'default'
}

export const Button: FunctionComponent<ButtonProps> = ({
  appearance,
  variant,
  size,
  icon,
  color,
  radius = 'default',
  ...props
}) => {
  const ActiveComponent = getActiveComponent(appearance)
  const themeContext = useContext(ThemeContext)
  return (
    <>
      <ActiveComponent
        variant={variant}
        size={size}
        appearance={appearance}
        icon={icon}
        color={color}
        radius={radius}
        {...props}
      >
        {icon ? (
          <Icon
            size={IconSizing.font[size]}
            color={color ?? getColor(appearance, themeContext, !!icon)}
            name={icon}
          />
        ) : (
          props.children
        )}
      </ActiveComponent>
    </>
  )
}
