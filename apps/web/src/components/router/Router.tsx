import { CoverLayout, Loader, PageLayout } from '@bloxifi/ui'
import React, { FC, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Header } from '../header/Header'

import { PublicRoute } from './PublicRoute'

import { PageContainer } from '@/containers/PageContainer'
import routes from '@/routes.json'
import PageNotFound from '@/pages/404'

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
    setHeader(<Header />)
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
