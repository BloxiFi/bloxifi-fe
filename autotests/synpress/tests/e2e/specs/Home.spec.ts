import { Staking } from '../pages/staking-page'

let metamaskWalletAddress

describe('Test Bloxifi', () => {
  context('Test commands', () => {
    it(`setupMetamask should finish metamask setup using secret words`, () => {
      cy.setupMetamask('', '', Cypress.env('WALLET_PASSWORD'))
      cy.getNetwork().then(id => {
        console.log(id)
        if (id !== 1287) {
          cy.addMetamaskNetwork({
            networkName: 'Moonbase Alpha',
            rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
            chainId: 1287,
            symbol: 'DEV',
            blockExplorer: 'https://moonbase.moonscan.io/',
            isTestnet: true,
          })
        }
      })

      cy.visit('/')
    })

    it('Open Bloxifi', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.acceptMetamaskAccess(false)
      cy.visit('/staking')
      Staking.clickStake()
      cy.confirmMetamaskTransaction({ gasFee: 1000 })
      Staking.waitForStake()
    })
  })
})
