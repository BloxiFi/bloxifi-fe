import { PageLayout } from '@bloxifi/ui'
import React, { FC, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Header } from '../Header/Header'

import { PublicRoute } from './PublicRoute'

import { PageContainer } from '@/containers/PageContainer'
import routes from '@/routes.json'

export const Router: FC = ({ children }) => {
  const { pageLayout } = PageContainer.useContainer()
  const { setHeader } = pageLayout

  function renderRoute({ path, filename }) {
    const routeProps = {
      key: path,
      component: lazy(() => import(`@/pages/${filename}`)),
    }

    return (
      <Route path={path} key={path} element={<PublicRoute {...routeProps} />} />
    )
  }

  useEffect(() => {
    setHeader(
      <PageLayout.Header>
        <Header />
      </PageLayout.Header>,
    )
  }, [setHeader])

  return (
    <BrowserRouter>
      <PageLayout {...pageLayout}>
        {children}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>{routes.map(route => renderRoute(route))}</Routes>
        </Suspense>
      </PageLayout>
    </BrowserRouter>
  )
}
