import { createGlobalStyle } from 'styled-components'

import ClashDisplayFontBold from './fonts/ClashDisplay/ClashDisplay-Bold.woff'
import ClashDisplayFontSemiBold from './fonts/ClashDisplay/ClashDisplay-SemiBold.woff'
import InterFontSemiBold from './fonts/Inter/Inter-SemiBold.woff'
import InterFontRegular from './fonts/Inter/Inter-Regular.woff'

export const GlobalStyle = createGlobalStyle<{
  theme: any
}>`
  @font-face {
    font-family: "Clash Display";
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: local('Clash Display'), url(${ClashDisplayFontSemiBold}) format('woff');
  }
  
  @font-face {
    font-family: "Clash Display";
    font-style: normal;
    font-weight: bold;
    font-display: swap;
    src: local('Clash Display'), url(${ClashDisplayFontBold}) format('woff');
  }
  
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: local('Inter'), url(${InterFontRegular}) format('woff');
  }
  
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-display: swap;
    src: local('Inter Bold'), url(${InterFontSemiBold}) format('woff');
  }
`
