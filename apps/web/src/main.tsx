import '@bloxifi/ui/src/fonts/fonts.less'
import 'normalize.css'
import './sw'

import React from 'react'
import ReactDOM from 'react-dom'
import { initTranslations } from '@bloxifi/core'

import { App } from './App'

import { StyleContainer } from '@/containers/StyleContainer'

declare global {
  interface Window {
    Typekit: any
  }
}

function init() {
  void initTranslations()

  ReactDOM.render(
    <StyleContainer.Provider>
      <App />
    </StyleContainer.Provider>,
    document.getElementById('main'),
  )
}

init()
