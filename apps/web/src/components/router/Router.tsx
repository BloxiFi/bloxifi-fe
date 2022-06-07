import { PageLayout } from '@bloxifi/ui'
import React, { FC, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Header } from '../Header/Header'

import { PublicRoute } from './PublicRoute'

import { PageContainer } from '@/containers/PageContainer'
import routes from '@/routes.json'
import { UserContainer } from '@/containers/UserContainer'

export const Router: FC = ({ children }) => {
  const {
    state: { isAuthenticated },
  } = UserContainer.useContainer()
  const { pageLayout } = PageContainer.useContainer()

  function renderRoute({ path, filename }) {
    const routeProps = {
      key: path,
      component: lazy(() => import(`@/pages/${filename}`)),
      isAuthenticated,
    }

    return <Route path={path} element={<PublicRoute {...routeProps} />} />
  }
  useEffect(() => {
    pageLayout.setHeader(<Header />)
  }, [])

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
