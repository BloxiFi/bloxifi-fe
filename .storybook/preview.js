import { DocsPage, DocsContainer } from '@storybook/addon-docs'
import { initTranslations } from '@bloxifi/core'
import { Colors, GlobalStyle } from '@bloxifi/ui'
import React from 'react'
import theme from './theme'
import { ThemeProvider } from 'styled-components'

initTranslations()

export const decorators = [
  Story => (
    <ThemeProvider theme={Colors['light']}>
      <div style={{ padding: '2rem' }}>
        <Story />
        <GlobalStyle />
      </div>
    </ThemeProvider>
  ),
]

export const parameters = {
  docs: {
    container: DocsContainer,
    page: DocsPage,
    theme,
  },
  options: {
    storySort: ([, { kind: a }], [, { kind: b }]) => {
      if (b.includes('Overview')) {
        return +1
      }

      return (a > b) - (a < b)
    },
  },
  controls: { expanded: true, hideNoControlsWarning: true },
}
