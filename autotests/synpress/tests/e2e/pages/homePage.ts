//Home page

export const HomePage = {
  //locators
  heading: () => cy.get('header'),
  dashboard_Link: () => cy.get('[data-cy="Dashboard"]'),
  depositAndBorrow_Link: () => cy.get('[data-cy="Deposit & Borrow"]'),
  connectWalletHeader_Button: () => cy.contains('Connect'),
  //actions
  visibilityOfPageElements: () => {
    HomePage.heading().should('be.visible')
    HomePage.dashboard_Link().should('be.visible')
  },
  goToDepositAndBorrowPage: () => {
    HomePage.depositAndBorrow_Link().click()
  },
  connectWalletFromHeader: () => {
    HomePage.connectWalletHeader_Button().click()
  },
}
