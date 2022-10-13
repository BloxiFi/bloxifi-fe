import { HomePage } from '../pages/homePage'
import { DepositAndBorrowPage, modalTypes } from '../pages/depositAndBorrow'

let isFirstTest = true
describe('Visibility of Deposit and Borrow Page', () => {
  beforeEach('Visit first subsystem', () => {
    cy.visit('/')
    HomePage.connectWalletFromHeader()
    if (isFirstTest) {
      cy.acceptMetamaskAccess(false)
    }
    isFirstTest = false
    HomePage.goToDepositAndBorrowPage()
  })
  it('Should check Your deposit elements visibility', () => {
    DepositAndBorrowPage.visibilityOfYourDepositElements()
  })
  // it('Should check Assets to deposit elements visibility', () => {
  //   DepositAndBorrowPage.visibilityOfAssetsDepositElements()
  // })
  // it('Should check Your borrow elements visibility', () => {
  //   DepositAndBorrowPage.visibilityOfYourBorrowElements()
  // })
  // it('Should check Assets to borrow elements visibility', () => {
  //   DepositAndBorrowPage.visibilityOfAssetsToBorrowElements()
  // })
})

// describe('Visibility of Deposit and Borrow Page Modals', () => {
//   beforeEach('Visit first subsystem', () => {
//     // Intercepting the graphql as alias `@graph`
//     cy.intercept(
//       'POST',
//       'https://api.thegraph.com/subgraphs/name/milos1991/bloxifi-protocol',
//     ).as('graph')
//
//     // Redirect directly to `/borrow` page
//     cy.visit('/borrow')
//
//     // should wait for graphql request
//     cy.wait('@graph').its('response.statusCode').should('eq', 200)
//
//     // Just connecting the wallet (no accepting metamask since it's already accepted in previous `describe`
//     HomePage.connectWalletFromHeader()
//
//     // Here we have multiple graphql requests fired with different responses (at-least it should be)
//     cy.wait('@graph').its('response.statusCode').should('eq', 200)
//     cy.wait('@graph').its('response.statusCode').should('eq', 200)
//     cy.wait('@graph').its('response.statusCode').should('eq', 200)
//   })
//
//   // Should go through all `modalTypes` and check their visibility
//   modalTypes.map(modalType => {
//     it(`Should check ${modalType} modal elements visibility`, () => {
//       DepositAndBorrowPage.visibilityOfModalElements(modalType)
//     })
//   })
// })
