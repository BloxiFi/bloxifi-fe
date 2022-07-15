import React from 'react'
import InlineSVG, { Props } from 'react-inlinesvg'
import styled from 'styled-components'

export const IconNames = [
  'close',
  'arrow-down',
  'arrow-up',
  'arrow-right',
  'settings',
  'total-borrowed',
  'total-deposited',
  'union',
] as const
export type IconNamesType = typeof IconNames[number]

export interface IconProps extends Omit<Props, 'src'> {
  /**
   * Possible values for `name` prop of `Icon` component.
   */
  readonly name: IconNamesType
  /**
   * This number represents width and height of icon. Defaults to 16px
   * */
  readonly size?: number
  /**
   * This represents icon color you want to render
   * */
  readonly color?: string
  /**
   * Optional prop that shows border around icon with small border radius
   */
  withBorder?: boolean
}

export const Icon = styled(
  ({ name, size = 16, color, className, ...props }: IconProps): JSX.Element => {
    const icon = require(`./icons/${name}.svg`) as string

    return (
      <InlineSVG
        src={icon}
        //TODO LOADER COMPONENT loader={<Loader loaderSize={size} />}
        style={{ width: size, height: size, fill: color }}
        className={`rts-icon ${className}`}
        preProcessor={code => code.replace(/fill=".*?"/g, 'fill="color"')}
        {...props}
      />
    )
  },
)<{
  withBorder?: boolean
  color?: string
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ withBorder = false, color = 'white' }) => {
    if (withBorder) {
      return `
        border: 0.5px solid ${color};
        padding: 8px;
        border-radius: 10px;
      `
    }
  }};
`
