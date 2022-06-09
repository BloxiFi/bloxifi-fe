type NetworkConfigType = { [x: number]: { name: string; isTestnet: boolean } }

const ChainIds = {
  moonbaseAlpha: 1287,
  moonbeam: 1284,
}

export const supportedChainIds: number[] = Object.values(ChainIds).map(value =>
  Number(value),
)

export const netowrkConfig: NetworkConfigType = {
  [ChainIds.moonbaseAlpha]: {
    name: 'Moonbase',
    isTestnet: true,
  },
  [ChainIds.moonbeam]: {
    name: 'Moonbeam',
    isTestnet: false,
  },
}

export const getNetworkName = (chainId: number): string => {
  if (netowrkConfig[chainId]) {
    return netowrkConfig[chainId].name
  }
  return 'Unknown'
}
