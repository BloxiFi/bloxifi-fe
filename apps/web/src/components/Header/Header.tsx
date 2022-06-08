import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { ConnectWalletButton } from '../WalletConnection/ConnectWalletButton'

export const Header = () => {
  return (
    <HeaderWrapper>
      <div>
        <HeaderLink to="/">Dashboard</HeaderLink>
        <HeaderLink to="/staking">Staking</HeaderLink>
      </div>

      <ConnectWalletButton />
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`
const HeaderLink = styled(Link)`
  margin: 0 10px;
`
