import { Colors } from '@bloxifi/ui'
import { create } from '@storybook/theming'
const base = 'light'

export default create({
  base,

  colorPrimary: Colors[base].purple70,
  colorSecondary: Colors[base].gray90,

  // UI
  appBg: Colors[base].background,
  appContentBg: Colors[base].chartTitleBackground,
  appBorderColor: Colors[base].borderColor,
  appBorderRadius: 4,

  // Typography
  fontBase: 'sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: Colors[base].gray90,
  textInverseColor: Colors[base].gray90,

  // Toolbar default and active colors
  barTextColor: Colors[base].gray90,
  barSelectedColor: Colors[base].gray80,
  barBg: Colors[base].gray30,

  // Form colors
  inputBg: Colors[base].background,
  inputBorder: Colors[base].borderColor,
  inputTextColor: Colors[base].gray90,
  inputBorderRadius: 4,

  brandTitle: 'BloxiFi',
  brandUrl: 'https://bloxico.com',
})
