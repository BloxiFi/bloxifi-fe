//Routes that require Polkadot connection
export const polkadotRoutes = ['/transfer/']

//Routes that require any connection
export const privateRoutes = ['/borrow/', '/staking/', '/transfer/']

/**
 * isPolkadotRoute checks if specific route requires Polkadot connection
 * @param path represents the route path
 * @returns boolean
 */
export const isPolkadotRoute = (path: string): boolean =>
  polkadotRoutes.includes(path)

/**
 * isPrivateRoute checks if specific route requires any connection
 * @param path represents the route path
 * @returns boolean
 */
export const isPrivateRoute = (path: string): boolean =>
  privateRoutes.includes(path)
