import { useQuery } from '@apollo/client'
import {
  DepositGraph,
  DepositGraphVariables,
  GRAPHQLEXAMPLEQUERY,
} from '@bloxifi/core'
import {
  Text,
  CoverLayout,
  CardLayout,
  BoxLayout,
  ContentLoader,
} from '@bloxifi/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PageContainer } from '@/containers/PageContainer'
import { StyleContainer } from '@/containers/StyleContainer'
import { LocaleContainer } from '@/containers/LocaleContainer'
import { Web3Container } from '@/containers/Web3Container'
import { ConnectWalletPaper } from '@/components/WalletConnection/ConnectWalletPaper'
import { Header } from '@/components/Header/Header'

const HomePage = () => {
  const { t } = useTranslation()
  const { setLanguage } = LocaleContainer.useContainer()
  const { changeTheme } = StyleContainer.useContainer()
  const { pageLayout } = PageContainer.useContainer()
  const {
    state: { isConnected, loading },
  } = Web3Container.useContainer()
  const { loading: loadingQuery } = useQuery<
    DepositGraph,
    DepositGraphVariables
  >(GRAPHQLEXAMPLEQUERY)

  return (
    <Wrapper>
      <CoverLayout>
        <BoxLayout>
          {loadingQuery ? <ContentLoader /> : <Text>Graph data loaded</Text>}
          <CardLayout>
            <Text align="left" type="heading 1" semiBold>
              {t('global.button')}
            </Text>
          </CardLayout>
        </BoxLayout>
        {!isConnected && <ConnectWalletPaper loading={loading} />}
        <button onClick={() => changeTheme('dark')}>Dark theme</button>
        <button
          onClick={() =>
            pageLayout.setHeader(!pageLayout.header ? <Header /> : null)
          }
        >
          {!pageLayout.header ? 'Add' : 'Remove'} header
        </button>
        <button onClick={() => changeTheme('light')}>Light theme</button>
        <button onClick={() => setLanguage('en')}>Change to Eng</button>
        <button onClick={() => setLanguage('sr')}>Change to Serbian</button>
      </CoverLayout>
    </Wrapper>
  )
}
export default HomePage

const Wrapper = styled.body`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
