export class Staking {
  static clickStake() {
    return cy.contains('Stake').click()
  }

  static waitForStake() {
    cy.log('on staking')
  }
}
