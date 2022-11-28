//TODO remove content from HEADER, it should be used in app.
import { ReactProps } from '@bloxifi/types'
import classNames from 'classnames'
import React from 'react'
import styled from 'styled-components'

import { CONTENT_MAX_WIDTH } from '../styles/constants'
import { Fonts } from '../styles/fonts'

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
  navigationItems: JSX.Element[]
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
        <HeaderBorder>
          <HeaderWrapper>
            <HeaderLinksWrapper>{navigationItems}</HeaderLinksWrapper>
            <HeaderButtonsWrapper>{children}</HeaderButtonsWrapper>
          </HeaderWrapper>
        </HeaderBorder>
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & HeaderProps,
) => JSX.Element

const HeaderBorder = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.headerWrapperBorderColor};
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: ${CONTENT_MAX_WIDTH + 4 * 16}px;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-left: auto;
  margin-right: auto;
  font-family: ${Fonts.ClashDisplay};
  border-bottom: 1px solid ${({ theme }) => theme.headerWrapperBorderColor};
`

const HeaderLinksWrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
`
const HeaderButtonsWrapper = styled.div`
  display: flex;
  align-items: center;

  & > button {
    margin-left: 13px;
  }
`
