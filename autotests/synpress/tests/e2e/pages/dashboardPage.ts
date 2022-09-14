//Dashboard page

export const DashboardPage = {
  //locators
  dashboardPageTitle_Text: () => cy.get('h1'),
  kusamaToken_Text: () => cy.contains('Kusama'),
  kusamaTokenAbbreviation_Text: () => cy.contains('KSMmb'),
  wrappedBitcoinToken_Text: () => cy.contains('Bitcoin'),
  wrappedBitcoinTokenAbbreviation_Text: () => cy.contains('WBTCmb'),
  daiToken_Text: () => cy.contains('DAI'),
  daiTokenAbbreviation_Text: () => cy.contains('DAImb'),
  wrappedEthereumToken_Text: () => cy.contains('Ethereum'),
  wrappedEthereumTokenAbbreviation_Text: () => cy.contains('WETHmb'),
  usdCoinToken_Text: () => cy.contains('Coin'),
  usdCoinTokenAbbreviation_Text: () => cy.contains('USDCmb'),
  moonriverToken_Text: () => cy.contains('Moonriver'),
  moonriverTokenAbbreviation_Text: () => cy.contains('MOWRmb'),
  //actions
  visibilityOfPageElements: () => {
    DashboardPage.dashboardPageTitle_Text().should('have.text', 'Dashboard')
    DashboardPage.kusamaToken_Text()
      .should('be.visible')
      .and('have.text', 'Kusama')
    DashboardPage.kusamaTokenAbbreviation_Text()
      .should('be.visible')
      .and('have.text', 'KSMmb')
    DashboardPage.wrappedBitcoinToken_Text()
      .should('be.visible')
      .and('have.text', 'Wrapped Bitcoin')
    DashboardPage.wrappedBitcoinTokenAbbreviation_Text()
      .should('be.visible')
      .and('have.text', 'WBTCmb')
    DashboardPage.daiToken_Text().should('be.visible').and('have.text', 'DAI')
    DashboardPage.daiTokenAbbreviation_Text()
      .should('be.visible')
      .and('have.text', 'DAImb')
    DashboardPage.wrappedEthereumToken_Text()
      .should('be.visible')
      .and('have.text', 'Wrapped Ethereum')
    DashboardPage.wrappedEthereumTokenAbbreviation_Text()
      .should('be.visible')
      .and('have.text', 'WETHmb')
    DashboardPage.usdCoinToken_Text()
      .should('be.visible')
      .and('have.text', 'USD Coin')
    DashboardPage.usdCoinTokenAbbreviation_Text()
      .should('be.visible')
      .and('have.text', 'USDCmb')
    DashboardPage.moonriverToken_Text()
      .should('be.visible')
      .and('have.text', 'Moonriver')
    DashboardPage.moonriverTokenAbbreviation_Text()
      .should('be.visible')
      .and('have.text', 'MOWRmb')
    cy.contains('Assets').should('be.visible')
    cy.contains('Total value deposited').should('be.visible')
    cy.contains('Total borrowed').should('be.visible')
    cy.contains('Deposit APY').should('be.visible')
    cy.contains('Borrow APY').should('be.visible')
    cy.contains('Total Deposited').should('be.visible')
    cy.contains('Total Borrowed').should('be.visible')
  },
}
