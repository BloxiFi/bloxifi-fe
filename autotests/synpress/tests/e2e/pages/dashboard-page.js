export class Dashboard {
  static connect() {
    return cy.contains('Connect').click()
  }

  static goToStaking() {
    return cy.contains('Staking').click()
  }
}
