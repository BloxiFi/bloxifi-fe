import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Fonts } from '@bloxifi/ui'

import { ConnectWalletButton } from '../WalletConnection/ConnectWalletButton'

export const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderLinksWrapper>
        <HeaderLink to="/">Dashboard</HeaderLink>
        <HeaderLink to="/staking">Staking</HeaderLink>
        <HeaderLink to="/deposit">Deposit &amp; Borrow</HeaderLink>
      </HeaderLinksWrapper>

      <ConnectWalletButton />
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 64px;
  font-family: ${Fonts.ClashDisplay};
`
const HeaderLink = styled(Link)`
  margin-right: 32px;
  text-decoration: none;
  color: white;
`
const HeaderLinksWrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
`
