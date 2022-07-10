import { relativePosition } from '@bloxifi/core'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Button } from './Button'
import { Text } from './Text'

interface Props {
  /**
   * Repsresents menu button which opens/closes menu list.
   */
  toggler: ReactElement
  /**
   * Represents menu content
   */
  field: ReactElement
  /**
   * Left alignment relative to the toggler
   */
  left?: boolean
  /**
   * Right alignment relative to the toggler
   */
  right?: boolean
  /**
   * Bottom alignment relative to the toggler
   */
  bottom?: boolean
  /**
   * Force close menu
   */
  forceClose?: boolean
  /**
   * Close menu
   */
  onClose?: () => void
  /**
   * Additional space relative to the toggler
   */
  positionOffset?: { top: number; left: number }
}

export const Menu = (props: Props) => {
  const myRef = useRef(null)
  const containerRef = useRef(null)
  const [showField, setShow] = useState(false)

  const remove = e => {
    e.stopPropagation()

    if (myRef.current && myRef.current.contains(e.target)) {
      return
    }
    if (props.onClose) {
      props.onClose()
    }
    setShow(false)
    document.removeEventListener('mouseup', remove, false)
  }

  const show = () => {
    if (!showField) {
      setTimeout(() => {
        document.addEventListener('mouseup', remove, false)
        setShow(true)
        relativePosition(
          myRef.current,
          containerRef.current,
          props.right,
          props.left,
          props.bottom,
          props.positionOffset,
        )
      }, 100)
    }
  }

  useEffect(() => {
    if (myRef.current) {
      if (showField) {
        myRef.current.style.opacity = 0
        myRef.current.style.display = 'block'

        let last = +new Date()
        let opacity = 0
        const tick = () => {
          opacity =
            +myRef.current.style.opacity + (new Date().getTime() - last) / 250
          myRef.current.style.opacity = opacity

          last = +new Date()

          if (+opacity < 1) {
            return (
              (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
              setTimeout(tick, 16)
            )
          }
        }

        tick()
      } else {
        myRef.current.style.display = 'none'
      }
    }
  }, [showField])

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', remove, false)
    }
  }, [])

  useEffect(() => {
    if (props.forceClose) {
      if (props.onClose) {
        props.onClose()
      }
      setShow(false)
      document.removeEventListener('mouseup', remove, false)
    }
  }, [props.forceClose])

  return (
    <Wrapper data-element="menuWrapper" ref={containerRef}>
      {React.cloneElement(props.toggler, {
        onMouseUp: () => show(),
      })}
      {showField
        ? React.cloneElement(<Element>{props.field}</Element>, {
            ref: node => (myRef.current = node),
          })
        : null}
    </Wrapper>
  )
}

const Wrapper = styled.span`
  display: flex;
  position: relative;
`

const Element = styled.div`
  position: absolute;
  box-shadow: ${({ theme }) => theme.menuShadow};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.white};
  display: none;
  z-index: 2;
  white-space: nowrap;
  min-width: 260px;
`

export const MenuItem = styled(Button)<{ isLastItem?: boolean }>`
  padding: 0.75rem 2.185rem;
  color: ${({ theme }) => theme.buttonDark};
  justify-content: space-between;
  border-radius: ${({ isLastItem }) => (isLastItem ? '0 0 0.5rem 0.5rem' : 0)};

  &:hover {
    background: ${({ theme }) => theme.buttonLight};
    opacity: 1;
  }
`

export const MenuItemTitle = styled(Text)`
  padding: 0.75rem 2.185rem;
  margin: 0;
  border-bottom: 1px solid ${({ theme }) => theme.buttonLight};
  color: ${({ theme }) => theme.buttonGradient1};
`
