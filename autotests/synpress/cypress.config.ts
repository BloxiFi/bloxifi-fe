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
  testFiles: ['depositAndBorrow.spec.ts', '!(depositAndBorrow).spec.ts'],
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  pluginsFile: 'tests/e2e/plugins/index.js',
  supportFile: 'tests/e2e/support/index.js',
  viewportWidth: 1280,
  viewportHeight: 720,
  experimentalFetchPolyfill: true,
  responseTimeout: 60000,
  requestTimeout: 10000,
  watchForFileChanges: false, //disabled since metamask login will not work properly with this
  baseUrl: 'http://localhost:3000',
  chromeWebSecurity: true,
  taskTimeout: 60000,
  defaultCommandTimeout: 10000,
  retries: { runMode: 1, openMode: 0 },
})
