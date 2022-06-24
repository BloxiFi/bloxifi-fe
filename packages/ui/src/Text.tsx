import classNames from 'classnames'
import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'

import { FullWidth, Hidden } from './styles/mixins'
import { Fonts } from './styles/fonts'

export const TextStyle = [
  'heading 1',
  'heading 2',
  'heading 3',
  'body 1',
  'body 2',
  'body 3',
  'body 4',
  'body 5',
  'small-text',
] as const
type TextStyle = typeof TextStyle[number]

export const TextColors = [
  'red',
  'green',
  'white',
  'textColorLight',
  'textColorDark',
] as const
type TextColors = typeof TextColors[number]
const defaultElement = 'span'
const defaultHTMLElement = new Map<TextStyle, React.ElementType>([
  ['heading 1', 'h1'],
  ['heading 2', 'h2'],
  ['heading 3', 'h3'],
  ['body 1', 'p'],
  ['body 2', 'p'],
  ['body 3', 'p'],
  ['body 4', 'p'],
  ['body 5', 'p'],
  ['small-text', 'span'],
])

type TextProps = {
  /**
   * Type determines html tag and its font styles
   * Font Sizes:
   * h1 - 3.75rem (60px)
   * h2 - 1.5rem (24px)
   * h3 - 1rem (16px)
   * body 1 - 1.75rem (28px)
   * body 1 - 1.375rem (22px)
   * body 1 - 1.125rem (18px)
   * body 1 - 1rem (16px)
   * body 1 - 1.25rem (20px)
   * small-text - 1.125rem (18px)
   */
  type?: TextStyle
  /**
   * If text is required to have different color than default.
   * Class 'u-text--color-colorName' will be created so it can be styled outside this component
   */
  color?: TextColors

  /**
   * Use bold or light variant of font
   */
  bold?: boolean
  /**
   * Use semi-bold variant of font
   */
  semiBold?: boolean
  /**
   * Text align style property
   */
  align?: 'left' | 'right' | 'center'
  /**
   * Specify html element used to create text component
   */
  as?: React.ElementType
} & HTMLAttributes<HTMLOrSVGElement>

const TextComponent: FunctionComponent<TextProps> = ({
  type = 'body 1',
  color,
  as: Component = defaultHTMLElement.get(type) || defaultElement,
  children,
  className,
}: TextProps) => (
  <Component
    className={classNames(
      className,
      `c-text--${type.split(' ').join('-') || ''}`,
      color && `c-text--color-${color}`,
    )}
  >
    {children}
  </Component>
)

export const Text = styled(TextComponent)<TextProps>`
  ${({ type = 'body 1' }) => {
    switch (type) {
      case 'heading 1':
        return `
        font-size: 3.75rem;
        line-height: 4.615rem;
        font-weight: 600;
        font-family:${Fonts.ClashDisplay};
      `
      case 'heading 2':
        return `
        font-size: 1.5rem;
        line-height: 1.845rem;
        font-weight: 600;
        font-family:${Fonts.ClashDisplay};
      `
      case 'heading 3':
        return `
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 600;
        font-family:${Fonts.ClashDisplay};
      `
      case 'body 1':
        return `
        font-size: 0.875rem;
        line-height: 1.315rem;
        font-weight: normal;
        font-family:${Fonts.Inter};
      `
      case 'body 2':
        return `
        font-size: 1rem;
        line-height: 1.315rem;
        font-weight: normal;
        font-family:${Fonts.Inter};
      `
      case 'body 3':
        return `
        font-size: 1rem;
        line-height: 1.2rem;
        font-weight: 600;
        font-family:${Fonts.Inter};
      `
      case 'body 4':
        return `
        font-size: 1.5rem;
        line-height: 2.815rem;
        font-weight: bold;
        font-family:${Fonts.ClashDisplay};
      `
      case 'body 5':
        return `
        font-size: 1.25rem;
        line-height: 1.315rem;
        font-weight: normal;
        font-family:${Fonts.Inter};
      `
      case 'small-text':
        return `
        font-size: 0.75rem;
        line-height: 1.5rem;
        letter-spacing: -0.01em;
        font-weight: normal;
        font-family:${Fonts.Inter};
      `
    }
  }}
  color: ${({ color, theme }) => {
    switch (color) {
      case 'red':
        return theme.red60
      case 'green':
        return theme.green80
      case 'white':
        return theme.white
      case 'textColorLight':
        return theme.textColorLight
      case 'textColorDark':
        return theme.textColorDark
      default:
        return theme.textColorDark
    }
  }};
  ${({ className }) => FullWidth({ className })};
  ${({ className }) => Hidden({ className })};
  ${({ bold, semiBold }) => {
    return `font-weight: ${bold ? 'bold' : semiBold && 600};`
  }};
  ${({ align }) => {
    return align && `text-align: ${align}`
  }};
  justify-content: ${({ align }) => {
    switch (align) {
      case 'left':
        return 'flex-start'
      case 'right':
        return 'flex-end'
      case 'center':
        return 'center'
    }
  }};
  word-break: break-word;
`
