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
}

export const Button: FunctionComponent<ButtonProps> = ({
  appearance,
  variant,
  size,
  icon,
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
        {...props}
      >
        {icon ? (
          <Icon
            size={IconSizing.font[size]}
            color={getColor(appearance, themeContext, !!icon)}
            name={icon}
          />
        ) : (
          props.children
        )}
      </ActiveComponent>
    </>
  )
}
