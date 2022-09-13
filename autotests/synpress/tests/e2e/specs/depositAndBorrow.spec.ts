import { HomePage } from '../pages/homePage'
import { DepositAndBorrowPage } from '../pages/depositAndBorrow'

describe('Visibility of Deposit and Borrow Page', () => {
  beforeEach('Visit first subsystem', () => {
    cy.visit('/')
    HomePage.connectWalletFromHeader()
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

describe('Visibility of Deposit and Borrow Page Modals', () => {
  beforeEach('Visit first subsystem', () => {
    cy.visit('/')
    HomePage.connectWalletFromHeader()
    HomePage.goToDepositAndBorrowPage()
  })
  it('Should check withdraw modal elements visibility', () => {
    DepositAndBorrowPage.visibilityOfWithdrawalModalElements()
  })
  it('Should check deposit modal elements visibility', () => {
    DepositAndBorrowPage.visibilityOfDepositModalElements()
  })
  it('Should check repay modal elements visibility', () => {
    DepositAndBorrowPage.visibilityOfRepayModalElements()
  })
  it('Should check borrow modal elements visibility', () => {
    DepositAndBorrowPage.visibilityOfBorrowModalElements()
  })
})
