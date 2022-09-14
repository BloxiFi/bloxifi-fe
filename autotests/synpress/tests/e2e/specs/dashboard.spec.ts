import { HomePage } from '../pages/homePage'
import { DashboardPage } from '../pages/dashboardPage'

describe('Visibility of Dashboard Page', () => {
  beforeEach('Visit first subsystem', () => {
    cy.visit('/')
    HomePage.connectWalletFromHeader()
  })
  it('Should check Dashboard Page elements visibility', () => {
    DashboardPage.visibilityOfPageElements()
  })
})


