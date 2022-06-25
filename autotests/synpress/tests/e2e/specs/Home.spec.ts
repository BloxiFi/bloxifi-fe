import { Staking } from '../pages/staking-page'

let metamaskWalletAddress

describe('Test Bloxifi', () => {
  before(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  it('Add Moonbase netowork to Metamask', () => {
    cy.addMetamaskNetwork({
      networkName: 'Moonbase Alpha',
      rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: '1287',
      symbol: 'DEV',
      blockExplorer: 'https://moonbase.moonscan.io/',
      isTestnet: true,
    })
  })
  context('Connect metamask wallet', () => {
    it('Open Bloxifi', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.acceptMetamaskAccess(false)
      cy.waitUntil(() => cy.contains('Moonbase').should('exist'))
      cy.visit('/staking')
      Staking.clickStake()
      cy.confirmMetamaskTransaction({ gasFee: 1000 })
      Staking.waitForStake()
    })
  })
})
