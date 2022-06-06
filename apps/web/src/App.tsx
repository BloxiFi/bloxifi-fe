import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Colors } from '@bloxifi/ui'
import { Web3ReactProvider } from '@web3-react/core'
import { providers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'

import { UserContainer } from '@/containers/UserContainer'
import { PageContainer } from '@/containers/PageContainer'
import { StyleContainer } from '@/containers/StyleContainer'
import { LocaleContainer } from '@/containers/LocaleContainer'
import { NotificationManager } from '@/components/notification/NotificationManager'
import { Router } from '@/components/router/Router'

export const App = () => {
  const style = StyleContainer.useContainer()

  function getWeb3Library(provider: ExternalProvider): providers.Web3Provider {
    const library = new providers.Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  return (
    <AppWrapper>
      <ThemeProvider theme={Colors[style.state.theme]}>
        <Web3ReactProvider getLibrary={getWeb3Library}>
          <NotificationManager />
          <PageContainer.Provider initialState={{ title: 'BloxiFi' }}>
            <UserContainer.Provider>
              <LocaleContainer.Provider>
                <Router />
              </LocaleContainer.Provider>
            </UserContainer.Provider>
          </PageContainer.Provider>
        </Web3ReactProvider>
      </ThemeProvider>
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  position: relative;
  background-color: ${Colors.background};
`
