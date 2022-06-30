describe('Test Bloxifi', () => {
  it('Open Bloxifi', () => {
    cy.changeMetamaskNetwork('moonbase alpha')
    cy.visit('/')
    cy.contains('Connect').click()
    cy.visit('/staking')
    cy.get('[data-cy-blox-mint="true"]').click()
    cy.etherscanWaitForTxSuccess('')

    cy.get('[data-cy-stake-content="true"]')
      .then($div => {
        // console.log($div)
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
          //Do something
        }
      })
  })
})
