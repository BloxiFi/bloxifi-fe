import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

import { CenterLayout } from './Layouts'
export interface ModalProps {
  /**
   * Boolean value that defines if modal is open or closed
   */
  isOpen?: boolean
  /**
   * Function that defines click event
   */
  onClick?: () => void
  /**
   * Function that defines closing of modal
   */
  onClose?: () => void
  /**
   * Boolean value that defines if close button should be displayed
   */
  showCloseButton?: boolean
  /**
   * Props that defines children elements
   */
  children?: React.ReactNode
}

export const Modal: FunctionComponent<ModalProps> = ({
  isOpen = false,
  onClose,
  showCloseButton = true,
  ...props
}) => {
  return isOpen ? (
    <Container>
      <Content>
        {showCloseButton && <CloseButton onClick={onClose}>X</CloseButton>}
        {props.children}
      </Content>
    </Container>
  ) : null
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.modalBackgroud};
`

const Content = styled(CenterLayout)`
  position: absolute;
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 1.875rem;
  background: ${({ theme }) => theme.white};
  box-shadow: ${({ theme }) => theme.modalShadow};
  border-radius: 0.345rem;
  color: ${({ theme }) => theme.textColorLight};
  z-index: 101;

  @media (max-width: 420px) {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    height: auto;
  }
`
//TODO-USE ICON COMPONENT HERE WHEN ITS FINISHED
const CloseButton = styled.span`
  margin-left: auto;
`
