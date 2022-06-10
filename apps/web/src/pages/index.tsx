import { Text, CoverLayout, BoxLayout } from '@bloxifi/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'

import { PageContainer } from '@/containers/PageContainer'
import { StyleContainer } from '@/containers/StyleContainer'
import { LocaleContainer } from '@/containers/LocaleContainer'
import { Web3Container } from '@/containers/Web3Container'
import { ConnectWalletPaper } from '@/components/WalletConnection/ConnectWalletPaper'

const HomePage = () => {
  const { t } = useTranslation()
  const { setLanguage } = LocaleContainer.useContainer()
  const { changeTheme } = StyleContainer.useContainer()
  const { pageLayout } = PageContainer.useContainer()
  const themeContext = useContext(ThemeContext)
  const {
    state: { isConnected, loading },
  } = Web3Container.useContainer()

  return (
    <Wrapper>
      <CoverLayout>
        <BoxLayout style={{ background: themeContext.white }}>
          <Text type="heading 1" semiBold align="center">
            {t('global.button')}
          </Text>
        </BoxLayout>
        {!isConnected && <ConnectWalletPaper loading={loading} />}
        <button onClick={() => changeTheme('dark')}>Dark theme</button>
        <button
          onClick={() =>
            pageLayout.setHeader(!pageLayout.header ? <div>HEADER</div> : null)
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
