import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Colors, GlobalStyle } from '@bloxifi/ui'
import { Web3ReactProvider } from '@web3-react/core'
import { providers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'

import { Web3Container } from './containers/Web3Container'

import { PageContainer } from '@/containers/PageContainer'
import { StyleContainer } from '@/containers/StyleContainer'
import { LocaleContainer } from '@/containers/LocaleContainer'
import { Router } from '@/components/router/Router'

const GRAPHQL_URL = process.env.GRAPHQL_URL

export const App = () => {
  const style = StyleContainer.useContainer()

  function getWeb3Library(provider: ExternalProvider): providers.Web3Provider {
    const library = new providers.Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  const client = new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache(),
  })

  return (
    <ThemeProvider theme={Colors[style.state.theme]}>
      <AppWrapper>
        <GlobalStyle {...style.state} />
        <Web3ReactProvider getLibrary={getWeb3Library}>
          <Web3Container.Provider>
            <ApolloProvider client={client}>
              <PageContainer.Provider initialState={{ title: 'BloxiFi' }}>
                <LocaleContainer.Provider>
                  <Router />
                </LocaleContainer.Provider>
              </PageContainer.Provider>
            </ApolloProvider>
          </Web3Container.Provider>
        </Web3ReactProvider>
      </AppWrapper>
    </ThemeProvider>
  )
}

const AppWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.background};
`
