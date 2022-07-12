export const HomePage = {
  //locators
  heading: () => cy.get('header'),
  dashboardLink: () => cy.get('[data-cy="Dashboard"]'),
  //actions
  visibilityOfPageElements: () => {
    HomePage.heading().should('be.visible')
    HomePage.dashboardLink().should('be.visible')
  },
}
