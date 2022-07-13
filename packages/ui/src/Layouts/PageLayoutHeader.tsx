//TODO remove content from HEADER, it should be used in app.
import { ReactProps } from '@bloxifi/types'
import classNames from 'classnames'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Fonts } from '../styles/fonts'

interface NavigationItem {
  to: string
  label: string
  onClick?: () => void
}

export interface HeaderProps {
  /**
   * The element to render the `<Header>` as. Defaults to 'header'.
   */
  readonly as?: React.ElementType
  /**
   * The header content.
   */
  readonly children?: React.ReactNode
  /**
   * Links provided for navigation
   */
  navigationItems: NavigationItem[]
}

const defaultElement = 'header'

export const PageLayoutHeader = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      navigationItems,
      children,
      ...props
    }: HeaderProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-page-layout__header',
      (props as { className?: string }).className,
    )

    return (
      <Component ref={ref} {...props} className={className}>
        <HeaderWrapper>
          <HeaderLinksWrapper>
            {navigationItems.map(({ to, label, onClick }) => (
              <HeaderLink data-cy={label} key={to} to={to} onClick={onClick}>
                {label}
              </HeaderLink>
            ))}
          </HeaderLinksWrapper>
          <HeaderButtonsWrapper>{children}</HeaderButtonsWrapper>
        </HeaderWrapper>
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & HeaderProps,
) => JSX.Element

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 64px;
  font-family: ${Fonts.ClashDisplay};
  border-bottom: 1px solid ${({ theme }) => theme.headerWrapperBorderColor};
`
//TODO@all add animation when border appears
const HeaderLink = styled(NavLink)`
  margin-right: 32px;
  text-decoration: none;
  color: white;
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom: 2px solid;
    border-image-source: ${({ theme }) =>
      `linear-gradient(270deg, ${theme.activeHeaderItemBorderColorStart} 0%, ${theme.activeHeaderItemBorderColorEnd} 100%)`};
    border-image-slice: 1;
  }
`

const HeaderLinksWrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
`
const HeaderButtonsWrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-left: 13px;
  }
`
