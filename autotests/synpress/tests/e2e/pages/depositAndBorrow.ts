//Deposit and Borrow page

export const DepositAndBorrowPage = {
  //Locators
  //Your deposit
  depositBalance_Text: () => cy.get('[data-cy="depositedBalance"]'),
  depositBalance_Value: () => cy.get('[data-cy="depositedBalanceUSD"] span'),
  collateral_Text: () => cy.get('[data-cy="collateralBalance"]'),
  collateral_Value: () => cy.get('[data-cy="collateralBalanceUSD"] span'),
  KSMWithdraw_Button: () => cy.get('[data-cy="withdrawBtn KSMmb"]'),
  WBTCmbWithdraw_Button: () => cy.get('[data-cy="withdrawBtn WBTCmb"]'),
  DAIWithdraw_Button: () => cy.get('[data-cy="withdrawBtn DAImb"]'),
  WETHmbWithdraw_Button: () => cy.get('[data-cy="withdrawBtn WETHmb"]'),
  USDCmbWithdraw_Button: () => cy.get('[data-cy="withdrawBtn USDCmb"]'),
  MOWRmbWithdraw_Button: () => cy.get('[data-cy="withdrawBtn MOWRmb"]'),
  KSMCollateral_Toggle: () => cy.get('[data-cy="collateralToggle KSMmb"]'),
  WBTCmbCollateral_Toggle: () => cy.get('[data-cy="collateralToggle WBTCmb"]'),
  DAICollateral_Toggle: () => cy.get('[data-cy="collateralToggle DAImb"]'),
  WETHmbCollateral_Toggle: () => cy.get('[data-cy="collateralToggle WETHmb"]'),
  USDCmbCollateral_Toggle: () => cy.get('[data-cy="collateralToggle USDCmb"]'),
  MOWRmbCollateral_Toggle: () => cy.get('[data-cy="collateralToggle MOWRmb"]'),
  KSMDepositedBalance_Value: () =>
    cy.get('[data-cy="depositedBalance KSMmb"] span'),
  WBTCmbDepositedBalance_Value: () =>
    cy.get('[data-cy="depositedBalance WBTCmb"] span'),
  DAIDepositedBalance_Value: () =>
    cy.get('[data-cy="depositedBalance DAImb"] span'),
  WETHmbDepositedBalance_Value: () =>
    cy.get('[data-cy="depositedBalance WETHmb"] span'),
  USDCmbDepositedBalance_Value: () =>
    cy.get('[data-cy="depositedBalance USDCmb"] span'),
  MOWRmbDepositedBalance_Value: () =>
    cy.get('[data-cy="depositedBalance MOWRmb"] span'),
  //Assets to deposit
  KSMDeposit_Button: () => cy.get('[data-cy="depositBtn KSMmb"]'),
  WBTCmbDeposit_Button: () => cy.get('[data-cy="depositBtn WBTCmb"]'),
  DAIDeposit_Button: () => cy.get('[data-cy="depositBtn DAImb"]'),
  WETHmbDeposit_Button: () => cy.get('[data-cy="depositBtn WETHmb"]'),
  USDCmbDeposit_Button: () => cy.get('[data-cy="depositBtn USDCmb"]'),
  MOWRmbDeposit_Button: () => cy.get('[data-cy="depositBtn MOWRmb"]'),
  KSMWalletBalance_Value: () => cy.get('[data-cy="walletBalance KSMmb"] span'),
  WBTCmbWalletBalance_Value: () =>
    cy.get('[data-cy="walletBalance WBTCmb"] span'),
  DAIWalletBalance_Value: () => cy.get('[data-cy="walletBalance DAImb"] span'),
  WETHmbWalletBalance_Value: () =>
    cy.get('[data-cy="walletBalance WETHmb"] span'),
  USDCmbWalletBalance_Value: () =>
    cy.get('[data-cy="walletBalance USDCmb"] span'),
  MOWRmbWalletBalance_Value: () =>
    cy.get('[data-cy="walletBalance MOWRmb"] span'),
  //Your borrow
  KSMRepay_Button: () => cy.get('[data-cy="repayBtn KSMmb"]'),
  WBTCmbRepay_Button: () => cy.get('[data-cy="repayBtn WBTCmb"]'),
  DAIRepay_Button: () => cy.get('[data-cy="repayBtn DAImb"]'),
  WETHmbRepay_Button: () => cy.get('[data-cy="repayBtn WETHmb"]'),
  USDCmbRepay_Button: () => cy.get('[data-cy="repayBtn USDCmb"]'),
  MOWRmbRepay_Button: () => cy.get('[data-cy="repayBtn MOWRmb"]'),
  KSMBorrowBalance_Value: () => cy.get('[data-cy="borrowBalance KSMmb"] span'),
  WBTCmbBorrowBalance_Value: () =>
    cy.get('[data-cy="borrowBalance WBTCmb"] span'),
  DAIBorrowBalance_Value: () => cy.get('[data-cy="borrowBalance DAImb"] span'),
  WETHmbBorrowBalance_Value: () =>
    cy.get('[data-cy="borrowBalance WETHmb"] span'),
  USDCmbBorrowBalance_Value: () =>
    cy.get('[data-cy="borrowBalance USDCmb"] span'),
  MOWRmbBorrowBalance_Value: () =>
    cy.get('[data-cy="borrowBalance MOWRmb"] span'),
  //Assets to borrow
  KSMBorrow_Button: () => cy.get('[data-cy="borrowBtn KSMmb"]'),
  WBTCmbBorrow_Button: () => cy.get('[data-cy="borrowBtn WBTCmb"]'),
  DAIBorrow_Button: () => cy.get('[data-cy="borrowBtn DAImb"]'),
  WETHmbBorrow_Button: () => cy.get('[data-cy="borrowBtn WETHmb"]'),
  USDCmbBorrow_Button: () => cy.get('[data-cy="borrowBtn USDCmb"]'),
  MOWRmbBorrow_Button: () => cy.get('[data-cy="borrowBtn MOWRmb"]'),
  KSMAvailableToBorrow_Value: () =>
    cy.get('[data-cy="availableToBorrow KSMmb"] span'),
  WBTCmbAvailableToBorrow_Value: () =>
    cy.get('[data-cy="availableToBorrow WBTCmb"] span'),
  DAIAvailableToBorrow_Value: () =>
    cy.get('[data-cy="availableToBorrow DAImb"] span'),
  WETHmbAvailableToBorrow_Value: () =>
    cy.get('[data-cy="availableToBorrow WETHmb"] span'),
  USDCmbAvailableToBorrow_Value: () =>
    cy.get('[data-cy="availableToBorrow USDCmb"] span'),
  MOWRmbAvailableToBorrow_Value: () =>
    cy.get('[data-cy="availableToBorrow MOWRmb"] span'),

  //Actions
  visibilityOfYourDepositElements: () => {
    DepositAndBorrowPage.depositBalance_Text().should('be.visible')
    DepositAndBorrowPage.depositBalance_Value().should('be.visible')
    DepositAndBorrowPage.collateral_Text().should('be.visible')
    DepositAndBorrowPage.collateral_Value().should('be.visible')
    DepositAndBorrowPage.KSMWithdraw_Button().should('be.visible')
    DepositAndBorrowPage.WBTCmbWithdraw_Button().should('be.visible')
    DepositAndBorrowPage.DAIWithdraw_Button().should('be.visible')
    DepositAndBorrowPage.WETHmbWithdraw_Button().should('be.visible')
    DepositAndBorrowPage.USDCmbWithdraw_Button().should('be.visible')
    DepositAndBorrowPage.MOWRmbWithdraw_Button().should('be.visible')
    DepositAndBorrowPage.KSMCollateral_Toggle().should('exist')
    DepositAndBorrowPage.WBTCmbCollateral_Toggle().should('exist')
    DepositAndBorrowPage.DAICollateral_Toggle().should('exist')
    DepositAndBorrowPage.WETHmbCollateral_Toggle().should('exist')
    DepositAndBorrowPage.USDCmbCollateral_Toggle().should('exist')
    DepositAndBorrowPage.MOWRmbCollateral_Toggle().should('exist')
    DepositAndBorrowPage.KSMDepositedBalance_Value().should('be.visible')
    DepositAndBorrowPage.WBTCmbDepositedBalance_Value().should('be.visible')
    DepositAndBorrowPage.DAIDepositedBalance_Value().should('be.visible')
    DepositAndBorrowPage.WETHmbDepositedBalance_Value().should('be.visible')
    DepositAndBorrowPage.USDCmbDepositedBalance_Value().should('be.visible')
    DepositAndBorrowPage.MOWRmbDepositedBalance_Value().should('be.visible')
  },
  visibilityOfAssetsDepositElements: () => {
    DepositAndBorrowPage.KSMDeposit_Button().should('be.visible')
    DepositAndBorrowPage.WBTCmbDeposit_Button().should('be.visible')
    DepositAndBorrowPage.DAIDeposit_Button().should('be.visible')
    DepositAndBorrowPage.WETHmbDeposit_Button().should('be.visible')
    DepositAndBorrowPage.USDCmbDeposit_Button().should('be.visible')
    DepositAndBorrowPage.MOWRmbDeposit_Button().should('be.visible')
    DepositAndBorrowPage.KSMWalletBalance_Value().should('be.visible')
    DepositAndBorrowPage.WBTCmbWalletBalance_Value().should('be.visible')
    DepositAndBorrowPage.DAIWalletBalance_Value().should('be.visible')
    DepositAndBorrowPage.WETHmbWalletBalance_Value().should('be.visible')
    DepositAndBorrowPage.USDCmbWalletBalance_Value().should('be.visible')
    DepositAndBorrowPage.MOWRmbWalletBalance_Value().should('be.visible')
  },
  visibilityOfYourBorrowElements: () => {
    DepositAndBorrowPage.KSMRepay_Button().should('be.visible')
    DepositAndBorrowPage.WBTCmbRepay_Button().should('be.visible')
    DepositAndBorrowPage.DAIRepay_Button().should('be.visible')
    DepositAndBorrowPage.WETHmbRepay_Button().should('be.visible')
    DepositAndBorrowPage.USDCmbRepay_Button().should('be.visible')
    DepositAndBorrowPage.MOWRmbRepay_Button().should('be.visible')
    DepositAndBorrowPage.KSMBorrowBalance_Value().should('be.visible')
    DepositAndBorrowPage.WBTCmbBorrowBalance_Value().should('be.visible')
    DepositAndBorrowPage.DAIBorrowBalance_Value().should('be.visible')
    DepositAndBorrowPage.WETHmbBorrowBalance_Value().should('be.visible')
    DepositAndBorrowPage.USDCmbBorrowBalance_Value().should('be.visible')
    DepositAndBorrowPage.MOWRmbBorrowBalance_Value().should('be.visible')
  },
  visibilityOfAssetsToBorrowElements: () => {
    DepositAndBorrowPage.KSMBorrow_Button().should('be.visible')
    DepositAndBorrowPage.WBTCmbBorrow_Button().should('be.visible')
    DepositAndBorrowPage.DAIBorrow_Button().should('be.visible')
    DepositAndBorrowPage.WETHmbBorrow_Button().should('be.visible')
    DepositAndBorrowPage.USDCmbBorrow_Button().should('be.visible')
    DepositAndBorrowPage.MOWRmbBorrow_Button().should('be.visible')
    DepositAndBorrowPage.KSMAvailableToBorrow_Value().should('be.visible')
    DepositAndBorrowPage.WBTCmbAvailableToBorrow_Value().should('be.visible')
    DepositAndBorrowPage.DAIAvailableToBorrow_Value().should('be.visible')
    DepositAndBorrowPage.WETHmbAvailableToBorrow_Value().should('be.visible')
    DepositAndBorrowPage.USDCmbAvailableToBorrow_Value().should('be.visible')
    DepositAndBorrowPage.MOWRmbAvailableToBorrow_Value().should('be.visible')
  },
}
