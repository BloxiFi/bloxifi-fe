import { HomePage } from '../pages/homePage'
import { DepositAndBorrowPage } from '../pages/depositAndBorrow'

describe('Visibility of Deposit and Borrow Page', () => {
  beforeEach('Visit first subsystem', () => {
    cy.visit('/')
    HomePage.connectWalletFromHeader()
    cy.acceptMetamaskAccess(false)
    HomePage.goToDepositAndBorrowPage()
  })
  it('Should check Your deposit elements visibility', () => {
    DepositAndBorrowPage.visibilityOfYourDepositElements()
  })
  it('Should check Assets to deposit elements visibility', () => {
    DepositAndBorrowPage.visibilityOfAssetsDepositElements()
  })
  it('Should check Your borrow elements visibility', () => {
    DepositAndBorrowPage.visibilityOfYourBorrowElements()
  })
  it('Should check Assets to borrow elements visibility', () => {
    DepositAndBorrowPage.visibilityOfAssetsToBorrowElements()
  })
})
