import { ReactProps } from '@bloxifi/types'
import classNames from 'classnames'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

/**
 * The CardLayout props.
 */
export interface CardLayoutProps {
  /**
   * The element to render the Card Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * Border
   */
  readonly border?: boolean
  /**
   * Border color
   */
  readonly borderColor?: string
  /**
   * Background color
   */
  readonly background?: string
}

const defaultElement = 'div'

/**
 * The Card Layout is used to define a "Card", i.e. a container for something.
 */
export const CardLayout = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      border = true,
      borderColor,
      background,
      ...props
    }: CardLayoutProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-card-layout',
      'c-card-layout--border' && border,
      (props as { className: string }).className,
    )
    const themeContext = useContext(ThemeContext)

    return (
      <Card
        as={Component}
        ref={ref}
        className={className}
        background={background || themeContext.white}
        border={border}
        borderColor={borderColor || themeContext.borderLight}
        {...props}
      />
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & CardLayoutProps,
) => JSX.Element

export const Card = styled(defaultElement)<CardLayoutProps>`
  display: block;
  border-radius: 0.315rem;
  width: 100%;
  background-color: ${props => props.background};
  ${({ border, borderColor }) => border && `border: 1px solid ${borderColor};`}
`
