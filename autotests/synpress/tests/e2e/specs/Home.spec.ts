import { HomePage } from '../pages/homePage'

describe('Test Bloxifi', () => {
  beforeEach('Visit first subsystem', () => {
    cy.visit('/')
  })
  it('Should check page elments visibility', () => {
    HomePage.visibilityOfPageElements()
  })
  // it('Open Bloxifi', () => {
  //   cy.changeMetamaskNetwork('moonbase alpha')
  //   cy.visit('/')
  //   cy.contains('Connect').click()
  //   cy.visit('/staking')
  //   cy.get('[data-cy-blox-mint="true"]').click()
  //   cy.confirmMetamaskTransaction(undefined)
  //   // eslint-disable-next-line cypress/no-unnecessary-waiting
  //   cy.wait(60000)
  //   // cy.waitUntil(() => cy.get('button[disabled]').then($el => $el.val()))
  //   cy.get('[data-cy-stake-content="true"]')
  //     .then($div => {
  //       console.log($div)
  //       if ($div.find('[data-cy-approve-button="true"]').length) {
  //         return '[data-cy-approve-button="true"]'
  //       } else {
  //         return '[data-cy-stake-button="true"]'
  //       }
  //     })
  //     .then(selector => {
  //       cy.get(selector).click()
  //       if (selector === '[data-cy-approve-button="true"]') {
  //         cy.confirmMetamaskPermissionToSpend()
  //       } else {
  //         //Do something
  //       }
  //     })
  // })
})
