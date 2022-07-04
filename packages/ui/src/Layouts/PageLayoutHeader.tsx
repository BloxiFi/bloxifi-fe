//TODO remove content from HEADER, it should be used in app.
import { ReactProps } from '@bloxifi/types'
import classNames from 'classnames'
import React from 'react'

export interface HeaderProps {
  /**
   * The element to render the `<Header>` as. Defaults to 'header'.
   */
  readonly as?: React.ElementType
  /**
   * The header content.
   */
  readonly children?: React.ReactNode
}

const defaultElement = 'header'

export const PageLayoutHeader = React.forwardRef(
  (
    { as: Component = defaultElement, children, ...props }: HeaderProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-page-layout__header',
      (props as { className?: string }).className,
    )

    return (
      <Component ref={ref} {...props} className={className}>
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & HeaderProps,
) => JSX.Element
