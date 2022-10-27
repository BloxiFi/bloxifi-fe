export const ChainIds = {
  moonbaseAlpha: 1287,
} as const

type ChainIdsNumber = typeof ChainIds[keyof typeof ChainIds]

export type NetworkConfigType = {
  [x in ChainIdsNumber]: { name: string; isTestnet: boolean }
}

export const supportedChainIds: number[] = Object.values(ChainIds).map(value =>
  Number(value),
)

export const isSupportedNetwork = (chainId: number): boolean =>
  supportedChainIds.includes(chainId)

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

export const MIN_VALUE_FOR_TRANSACTION = 0.0000001
export const MIN_HEALTH_FACTOR_VALUE = 1.01

/**
 * Polkadot network check
 */
type NetworkConfigPolkadotType = {
  [x: number]: { name: string; isTestnet: boolean; releyChain: string }
}

const PolkadotNetworkRegistry = [
  {
    prefix: 0,
    network: 'polkadot',
    displayName: 'Polkadot Relay Chain',
    symbols: ['DOT'],
    decimals: [10],
    standardAccount: '*25519',
    website: 'https://polkadot.network',
    relayChain: 'polkadot',
    paraId: 0,
  },
  {
    prefix: 2,
    network: 'kusama',
    displayName: 'Kusama Relay Chain',
    symbols: ['KSM'],
    decimals: [12],
    standardAccount: '*25519',
    website: 'https://kusama.network',
    relayChain: 'kusama',
    paraId: 0,
  },
  {
    prefix: 10,
    network: 'acala',
    displayName: 'Acala',
    symbols: ['ACA'],
    decimals: [12],
    standardAccount: '*25519',
    website: 'https://acala.network/',
    relayChain: 'polkadot',
    paraId: 2000,
  },
  {
    prefix: 8,
    network: 'karura',
    displayName: 'Karura',
    symbols: ['KAR'],
    decimals: [12],
    standardAccount: '*25519',
    website: 'https://karura.network/',
    relayChain: 'kusama',
    paraId: 2000,
  },
  {
    prefix: 1284,
    network: 'moonbeam',
    displayName: 'Moonbeam',
    symbols: ['GLMR'],
    decimals: [18],
    standardAccount: 'secp256k1',
    website: 'https://moonbeam.network',
    relayChain: 'polkadot',
    paraId: 2004,
  },
  {
    prefix: 1285,
    network: 'moonriver',
    displayName: 'Moonriver',
    symbols: ['MOVR'],
    decimals: [18],
    standardAccount: 'secp256k1',
    website: 'https://moonbeam.network',
    relayChain: 'kusama',
    paraId: 2023,
  },
] as const

export type SupportedNetwork = typeof PolkadotNetworkRegistry[number]

export const supportedChainIdsPolkadot: number[] = Object.values(
  PolkadotNetworkRegistry,
).map(value => Number(value))

export const isSupportedNetworkPolkadot = (paraId: number): boolean =>
  supportedChainIdsPolkadot.includes(paraId)

export const getNetworkByChain = (
  chainId: SupportedNetwork['prefix'],
): SupportedNetwork | undefined => {
  return PolkadotNetworkRegistry.find(network => network.prefix === chainId)
}

export const networkConfigPolkadot: NetworkConfigPolkadotType = {
  [2004]: {
    name: 'moonbase',
    isTestnet: false,
    releyChain: 'polkadot',
  },
}

export const getPolkadotNetworkName = (paraId: number): string => {
  if (networkConfigPolkadot[paraId]) {
    return networkConfigPolkadot[paraId].name
  }
  return 'Unknown'
}
