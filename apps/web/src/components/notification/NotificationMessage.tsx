import React, { FunctionComponent } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { Notification, NotificationStatus } from './NotificationManager'

function getNotificationIcon(status: NotificationStatus) {
  switch (status) {
    case 'SUCCESS':
      return <input name="check_mark" />
    case 'INFO':
      return <input name="info" />
    case 'WARNING':
      return <input name="warning" />
    case 'ERROR':
      return <input name="close" />
    default:
      break
  }
}

export const NotificationMessage: FunctionComponent<Notification> = ({
  id,
  status,
  message,
  error,
}) => {
  function renderError(error) {
    const errorMessage = error

    if (!errorMessage) {
      return null
    }

    return (
      <ul>
        <li>
          <div>{errorMessage}</div>
        </li>
      </ul>
    )
  }

  return (
    <Item id={id} status={status} data-element="notification">
      {getNotificationIcon(status)}
      <h4>{message}</h4>
      {error && renderError(error?.errorCode)}
    </Item>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  
  to {
    opacity: 1;
  }
`
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  
  to {
    opacity: 0;
  }
`
const Item = styled.div<{ status: string }>`
  min-width: 300px;
  max-width: 90%;
  margin-top: 0.8rem;
  padding: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 3px;
  color: ${({ theme }) => theme.white};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 3px 6px #00000029;
  font-size: 14px;

  h4 {
    white-space: pre;
    line-height: 1.5;
    margin: 0.5rem 0;
  }

  ul {
    flex: 1 1 100%;
    list-style: none;
    padding-left: 2.2rem;
    margin: 0;

    li {
      margin-bottom: 1rem;
    }
  }

  &.fade-out {
    animation: ${fadeOut} 0.3s ease;
  }

  ${({ status }) =>
    status === 'SUCCESS' &&
    css`
      background: ${({ theme }) => theme.green80};
    `}
  ${({ status }) =>
    status === 'INFO' &&
    css`
      background: ${({ theme }) => theme.primary};
    `}
  ${({ status }) =>
    status === 'WARNING' &&
    css`
      background: ${({ theme }) => theme.warningNotification};
    `}
  ${({ status }) =>
    status === 'ERROR' &&
    css`
      background: ${({ theme }) => theme.red80};
    `}
  
  [data-element="icon"] {
    margin-right: 1rem;
    display: flex;
    background: ${({ theme }) => theme.white};
    border-radius: 50%;
    height: 20px;
    width: 20px;
    align-items: center;
    justify-content: center;
  }
`
