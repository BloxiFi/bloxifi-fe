import { CoverLayout, BoxLayout } from '@bloxifi/ui'
import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

import { StakeModalContent } from '@/components/Staking/StakeModalContent'

const StakingPage = () => {
  const web3Context = useWeb3React()

  return (
    <Wrapper>
      <CoverLayout>
        <h1> Staking page</h1>
        <BoxLayout>
          {web3Context.active ? <StakeModalContent /> : 'Please connect wallet'}
        </BoxLayout>
      </CoverLayout>
    </Wrapper>
  )
}
export default StakingPage

const Wrapper = styled.body`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
