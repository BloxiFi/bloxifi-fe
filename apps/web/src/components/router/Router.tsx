import { CoverLayout, Loader, PageLayout } from '@bloxifi/ui'
import React, { FC, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Header } from '../header/Header'

import { PublicRoute } from './PublicRoute'
import { PrivateRoute } from './PrivateRoute'

import { PageContainer } from '@/containers/PageContainer'
import routes from '@/routes.json'
import PageNotFound from '@/pages/404'
import { Web3PolkadotContainer } from '@/containers/Web3PolkadotContainer'
import { Web3Container } from '@/containers/Web3Container'

export const Router: FC = ({ children }) => {
  const { pageLayout } = PageContainer.useContainer()
  const { setHeader } = pageLayout

  const polkadotRoutes = ['/transfer/']
  const privateRoutes = ['/borrow/', '/staking/', '/transfer/']

  function renderRoute({ path, filename }) {
    const routeProps = {
      key: path,
      component: lazy(() => import(`@/pages/${filename}`)),
    }
    return (
      <Route
        path={path}
        key={path}
        element={
          privateRoutes.includes(path) ? (
            <PrivateRoute
              isPolkadotConnRequired={polkadotRoutes.includes(path)}
              {...routeProps}
            />
          ) : (
            <PublicRoute {...routeProps} />
          )
        }
      />
    )
  }

  useEffect(() => {
    setHeader(
      <Web3Container.Provider>
        <Web3PolkadotContainer.Provider>
          <Header />
        </Web3PolkadotContainer.Provider>
      </Web3Container.Provider>,
    )
  }, [setHeader])

  return (
    <BrowserRouter>
      <PageLayout {...pageLayout}>
        {children}
        <Suspense
          fallback={
            <CoverLayout>
              <Loader />
            </CoverLayout>
          }
        >
          <Routes>
            {routes.map(route => renderRoute(route))}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </PageLayout>
    </BrowserRouter>
  )
}
