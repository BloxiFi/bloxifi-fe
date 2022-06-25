export const HomePage = {
  //locators
  heading: () => cy.get('h1'),
  //actions
  visibilityOfPageElements: () => {
    HomePage.heading().should('be.visible')
  },
}
