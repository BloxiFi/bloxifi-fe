import { createGlobalStyle } from 'styled-components'

import ClashDisplayFontBold from './fonts/ClashDisplay/ClashDisplay-Bold.woff'
import ClashDisplayFontSemiBold from './fonts/ClashDisplay/ClashDisplay-SemiBold.woff'
import InterFontSemiBold from './fonts/Inter/Inter-SemiBold.woff'
import InterFontRegular from './fonts/Inter/Inter-Regular.woff'

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Clash Display";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Clash Display Semi-Bold'), url(${ClashDisplayFontSemiBold}) format('woff');
  }
  
  @font-face {
    font-family: "Clash Display";
    font-style: normal;
    font-weight: bold;
    font-display: swap;
    src: local('Clash Display Bold'), url(${ClashDisplayFontBold}) format('woff');
  }
  
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: local('Inter Regular'), url(${InterFontRegular}) format('woff');
  }
  
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Inter Semi-Bold'), url(${InterFontSemiBold}) format('woff');
  }

  body * {
    box-sizing: border-box;
  }

  html,
  body {
    min-height: 100%;
    height: 100%;
    overscroll-behavior: none;
    overflow-y: unset;
  }

  #root {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    min-height: 100vh;

    > .c-page-layout {
      min-height: 100%;
      flex: 1 1 100%;
    }
  }
`
