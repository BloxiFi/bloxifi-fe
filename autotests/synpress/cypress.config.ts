import { defineConfig } from 'cypress'

require('dotenv').config()

export default defineConfig({
  env: {
    WALLET_PASSWORD: process.env.WALLET_PASSWORD,
    SKIP_METAMASK_SETUP: true,
    PRIVATE_KEY_WITH_FUNDS: '0x',
  },
  fixturesFolder: 'tests/e2e/fixtures',
  integrationFolder: 'tests/e2e/specs',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  pluginsFile: 'tests/e2e/plugins/index.js',
  supportFile: 'tests/e2e/support/index.js',
  viewportWidth: 1280,
  viewportHeight: 720,
  responseTimeout: 60000,
  baseUrl: 'http://localhost:8080',
  chromeWebSecurity: true,
  taskTimeout: 60000,
  retries: { runMode: 0, openMode: 0 },
})
