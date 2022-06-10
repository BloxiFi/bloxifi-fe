type NetworkConfigType = { [x: number]: { name: string; isTestnet: boolean } }

const ChainIds = {
  moonbaseAlpha: 1287,
}

export const supportedChainIds: number[] = Object.values(ChainIds).map(value =>
  Number(value),
)

export const networkConfig: NetworkConfigType = {
  [ChainIds.moonbaseAlpha]: {
    name: 'Moonbase',
    isTestnet: true,
  },
}

export const getNetworkName = (chainId: number): string => {
  if (networkConfig[chainId]) {
    return networkConfig[chainId].name
  }
  return 'Unknown'
}
