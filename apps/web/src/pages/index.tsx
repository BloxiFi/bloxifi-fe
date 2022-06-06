import { Text, CoverLayout, BoxLayout } from '@bloxifi/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'

import { StyleContainer } from '@/containers/StyleContainer'
import { LocaleContainer } from '@/containers/LocaleContainer'
import { ConnectWalletButton } from '@/components/WalletConnection/ConnectWalletButton'
import { Stake } from '@/components/Stake/Stake'

const HomePage = () => {
  const { t } = useTranslation()
  const { setLanguage } = LocaleContainer.useContainer()
  const { changeTheme } = StyleContainer.useContainer()
  const themeContext = useContext(ThemeContext)

  return (
    <Wrapper>
      <CoverLayout>
        <BoxLayout style={{ background: themeContext.white }}>
          <Text type="heading 1" semiBold align="center">
            {t('global.button')}
          </Text>
        </BoxLayout>
        <ConnectWalletButton />
        <Stake />
        <button onClick={() => changeTheme('dark')}>Dark theme</button>
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
