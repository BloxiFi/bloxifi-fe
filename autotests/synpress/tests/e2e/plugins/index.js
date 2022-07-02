const helpers = require('../support/helpers')
const puppeteer = require('../support/puppeteer')
const metamask = require('../support/metamask')
const synthetix = require('../support/synthetix')
const etherscan = require('../support/etherscan')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      // eslint-disable-next-line no-console
      console.log('TRUE') // required by cypress ¯\_(ツ)_/¯
      arguments_.args.push('--window-size=1920,1080')
      return arguments_
    }

    if (browser.name === 'electron') {
      arguments_['width'] = 1920
      arguments_['height'] = 1080
      arguments_['resizable'] = false
      return arguments_
    }

    // metamask welcome screen blocks cypress from loading
    if (browser.name === 'chrome') {
      arguments_.args.push(
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      )
    }
    if (!process.env.SKIP_METAMASK_INSTALL) {
      // NOTE: extensions cannot be loaded in headless Chrome
      const metamaskPath = await helpers.prepareMetamask(
        process.env.METAMASK_VERSION || '9.7.1',
      )
      arguments_.extensions.push(metamaskPath)
    }

    return arguments_
  })

  on('task', {
    error(message) {
      // eslint-disable-next-line no-console
      console.error('\u001B[31m', 'ERROR:', message, '\u001B[0m')
      return true
    },
    warn(message) {
      // eslint-disable-next-line no-console
      console.warn('\u001B[33m', 'WARNING:', message, '\u001B[0m')
      return true
    },
    // puppeteer commands
    initPuppeteer: async () => {
      return await puppeteer.init()
    },
    clearPuppeteer: async () => {
      return await puppeteer.clear()
    },
    assignWindows: async () => {
      return await puppeteer.assignWindows()
    },
    clearWindows: async () => {
      return await puppeteer.clearWindows()
    },
    assignActiveTabName: async tabName => {
      return await puppeteer.assignActiveTabName(tabName)
    },
    isMetamaskWindowActive: async () => {
      return await puppeteer.isMetamaskWindowActive()
    },
    isCypressWindowActive: async () => {
      return await puppeteer.isCypressWindowActive()
    },
    switchToCypressWindow: async () => {
      return await puppeteer.switchToCypressWindow()
    },
    switchToMetamaskWindow: async () => {
      return await puppeteer.switchToMetamaskWindow()
    },
    switchToMetamaskNotification: async () => {
      return await puppeteer.switchToMetamaskNotification()
    },
    unlockMetamask: async password => {
      return await metamask.unlock(password)
    },
    importMetamaskAccount: async privateKey => {
      return await metamask.importAccount(privateKey)
    },
    createMetamaskAccount: async accountName => {
      return await metamask.createAccount(accountName)
    },
    switchMetamaskAccount: async accountNameOrAccountNumber => {
      return await metamask.switchAccount(accountNameOrAccountNumber)
    },
    addMetamaskNetwork: async network => {
      return await metamask.addNetwork(network)
    },
    changeMetamaskNetwork: async network => {
      if (process.env.NETWORK_NAME && !network) {
        network = process.env.NETWORK_NAME
      } else if (!network) {
        network = 'kovan'
      }
      return await metamask.changeNetwork(network)
    },
    activateCustomNonceInMetamask: async () => {
      return await metamask.activateCustomNonce()
    },
    resetMetamaskAccount: async () => {
      return await metamask.resetAccount()
    },
    disconnectMetamaskWalletFromDapp: async () => {
      return await metamask.disconnectWalletFromDapp()
    },
    disconnectMetamaskWalletFromAllDapps: async () => {
      return await metamask.disconnectWalletFromAllDapps()
    },
    confirmMetamaskSignatureRequest: async () => {
      return await metamask.confirmSignatureRequest()
    },
    rejectMetamaskSignatureRequest: async () => {
      return await metamask.rejectSignatureRequest()
    },
    confirmMetamaskTypedV4SignatureRequest: async () => {
      return await metamask.confirmTypedV4SignatureRequest()
    },
    rejectMetamaskTypedV4SignatureRequest: async () => {
      return await metamask.rejectTypedV4SignatureRequest()
    },
    confirmMetamaskEncryptionPublicKeyRequest: async () => {
      return await metamask.confirmEncryptionPublicKeyRequest()
    },
    rejectMetamaskEncryptionPublicKeyRequest: async () => {
      return await metamask.rejectEncryptionPublicKeyRequest()
    },
    confirmMetamaskDecryptionRequest: async () => {
      return await metamask.confirmDecryptionRequest()
    },
    rejectMetamaskDecryptionRequest: async () => {
      return await metamask.rejectDecryptionRequest()
    },
    confirmMetamaskPermissionToSpend: async () => {
      return await metamask.confirmPermissionToSpend()
    },
    rejectMetamaskPermissionToSpend: async () => {
      return await metamask.rejectPermissionToSpend()
    },
    acceptMetamaskAccess: async allAccounts => {
      return await metamask.acceptAccess(allAccounts)
    },
    confirmMetamaskTransaction: async gasConfig => {
      return await metamask.confirmTransaction(gasConfig)
    },
    rejectMetamaskTransaction: async () => {
      return await metamask.rejectTransaction()
    },
    allowMetamaskToAddNetwork: async () => {
      return await metamask.allowToAddNetwork()
    },
    rejectMetamaskToAddNetwork: async () => {
      return await metamask.rejectToAddNetwork()
    },
    allowMetamaskToSwitchNetwork: async () => {
      return await metamask.allowToSwitchNetwork()
    },
    rejectMetamaskToSwitchNetwork: async () => {
      return await metamask.rejectToSwitchNetwork()
    },
    allowMetamaskToAddAndSwitchNetwork: async () => {
      return await metamask.allowToAddAndSwitchNetwork()
    },
    getMetamaskWalletAddress: async () => {
      return await metamask.getWalletAddress()
    },
    fetchMetamaskWalletAddress: async () => {
      return metamask.walletAddress()
    },
    setupMetamask: async ({
      secretWordsOrPrivateKey,
      network = 'kovan',
      password,
    }) => {
      if (process.env.NETWORK_NAME) {
        network = process.env.NETWORK_NAME
      }
      if (process.env.PRIVATE_KEY) {
        secretWordsOrPrivateKey = process.env.PRIVATE_KEY
      }
      if (process.env.SECRET_WORDS) {
        secretWordsOrPrivateKey = process.env.SECRET_WORDS
      }
      await metamask.initialSetup({
        secretWordsOrPrivateKey,
        network,
        password,
      })
      return true
    },
    snxExchangerSettle: async ({ asset, walletAddress, privateKey }) => {
      if (process.env.PRIVATE_KEY) {
        privateKey = process.env.PRIVATE_KEY
      }
      // todo: wait for confirmation?
      return await synthetix.settle({
        asset,
        walletAddress,
        privateKey,
      })
    },
    snxCheckWaitingPeriod: async ({ asset, walletAddress }) => {
      return await synthetix.checkWaitingPeriod({
        asset,
        walletAddress,
      })
    },
    getNetwork: () => {
      return helpers.getNetwork()
    },
    etherscanGetTransactionStatus: async ({ txid }) => {
      return await etherscan.getTransactionStatus(txid)
    },
    etherscanWaitForTxSuccess: async ({ txid }) => {
      const walletAdd = metamask.walletAddress()
      return await etherscan.waitForTxSuccess(walletAdd)
    },
  })

  if (process.env.BASE_URL) {
    config.baseUrl = process.env.BASE_URL
  }

  if (process.env.SKIP_METAMASK_SETUP) {
    config.env.SKIP_METAMASK_SETUP = true
  }

  return config
}
