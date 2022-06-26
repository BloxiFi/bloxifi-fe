import { Staking } from '../pages/staking-page'

let metamaskWalletAddress

describe('Test Bloxifi', () => {
  // cy.setupMetamask('', '', Cypress.env('WALLET_PASSWORD'))
  // cy.resetMetamaskAccount()
  // cy.getNetwork().then((network: any) => {
  //   if (network.networkId !== 1287) {
  //     cy.addMetamaskNetwork({
  //       networkName: 'moonbase alpha',
  //       rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
  //       chainId: 1287,
  //       symbol: 'DEV',
  //       blockExplorer: 'https://moonbase.moonscan.io/',
  //       isTestnet: true,
  //     })
  //   }
  // })

  it('Open Bloxifi', () => {
    cy.changeMetamaskNetwork('moonbase alpha')
    cy.visit('/')
    cy.contains('Connect').click()
    cy.visit('/staking')
    cy.get('[data-cy-blox-mint="true"]').click()
    cy.etherscanWaitForTxSuccess('')

    cy.get('[data-cy-stake-content="true"]')
      .then($div => {
        console.log($div)
        if ($div.find('[data-cy-approve-button="true"]').length) {
          return '[data-cy-approve-button="true"]'
        } else {
          return '[data-cy-stake-button="true"]'
        }
      })
      .then(selector => {
        cy.get(selector).click()
        if (selector === '[data-cy-approve-button="true"]') {
          cy.confirmMetamaskPermissionToSpend()
        } else {
        }
      })
  })
})
