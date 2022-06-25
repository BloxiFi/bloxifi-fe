import { Staking } from '../pages/staking-page'

let metamaskWalletAddress

describe('Test Bloxifi', () => {
  before(() => {
    cy.setupMetamask(
      'dumb, wreck, cricket, bachelor, amused, monitor, video, caution, easily, unfold, police, enough',
      {
        networkName: 'Moonbase Alpha',
        rpc: 'https://rpc.api.moonbase.moonbeam.network',
        chainId: 1287,
        isTestnet: true,
        symbol: 'DEV',
        blockExplorer: 'https://moonbase.moonscan.io/',
      },
      'Tolja123',
    )
    cy.visit('/')
  })
  context('Connect metamask wallet', () => {
    it('Open Bloxifi', () => {
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
