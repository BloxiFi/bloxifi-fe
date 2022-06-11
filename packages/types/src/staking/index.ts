/**
 * Async function that
 */
export type CheckAllowanceFunction = () => void

/**
 * Async function fetch total tokens amount that will update state
 */
export type FetchTokenBalanceFunction = () => void

/**
 * Async function fetch total staked tokens and update the state.
 */
export type FetchStakedBalance = () => void

/**
 * Async function that fetches cooldown type until user can withdraw the unstaked amount and update the state.
 */
export type FetchCooldownPeriod = () => void

/**
 * Async function that fetches total reward collected and update the state.
 */
export type FetchRewardBalance = () => void
