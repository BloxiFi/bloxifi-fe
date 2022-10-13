//Dashboard page

import * as Assets from '@bloxifi/core/src/utilities/assets.json'

import { tokenList, TokenType } from './depositAndBorrow'

export const DashboardPage = {
  //locators
  dashboardPageTitle_Text: () => cy.get('[data-cy="Dashboard"]'),
  token_Text: (token: TokenType) =>
    cy.get(`[data-cy="assetFullName-${token}"]`),
  token_Abbreviation_Text: (token: TokenType) =>
    cy.get(`[data-cy="assetName-${token}"]`),

  //actions
  visibilityOfPageElements: () => {
    //prove that you are on the dashboard page
    DashboardPage.dashboardPageTitle_Text().should('have.class', 'active')

    // check all the tokents and appropriate full name from `assets.json`
    tokenList.map(token => {
      DashboardPage.token_Text(token)
        .should('be.visible')
        .and('have.text', Assets[token].fullName)

      DashboardPage.token_Abbreviation_Text(token)
        .should('be.visible')
        .and('have.text', token)
    })

    // these should be removed at some point since they are checking hard-coded values, that can change at any point. It's fine as one of the first tests, but in the future tests should have more meaning.
    cy.contains('Assets').should('be.visible')
    cy.contains('Total value deposited').should('be.visible')
    cy.contains('Total borrowed').should('be.visible')
    cy.contains('Deposit APY').should('be.visible')
    cy.contains('Borrow APY').should('be.visible')
    cy.contains('Total Deposited').should('be.visible')
    cy.contains('Total Borrowed').should('be.visible')
  },
}
