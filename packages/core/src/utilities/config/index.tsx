export const MIN_VALUE_FOR_TRANSACTION = 0.0000001
export const MIN_HEALTH_FACTOR_VALUE = 1.01

type NetworkConfigType = {
  [x: number]: { name: string; isTestnet: boolean; releyChain: string }
}
//@TODO UPLOAD & UPDATE ICONS
const NetworkRegistry = [
  {
    prefix: 0,
    network: 'polkadot',
    displayName: 'Polkadot Relay Chain',
    symbols: ['DOT'],
    supportedSymbols: [],
    decimals: [10],
    standardAccount: '*25519',
    website: 'https://polkadot.network',
    relayChain: 'polkadot',
    paraId: 0,
    icon: 'polkadot',
    isTestnet: false,
  },
  {
    prefix: 2,
    network: 'kusama',
    displayName: 'Kusama Relay Chain',
    symbols: ['KSM'],
    supportedSymbols: [],
    decimals: [12],
    standardAccount: '*25519',
    website: 'https://kusama.network',
    relayChain: 'kusama',
    paraId: 0,
    icon: 'ksm',
    isTestnet: true,
  },
  {
    prefix: 10,
    network: 'acala',
    displayName: 'Acala',
    symbols: ['ACA'],
    supportedSymbols: [],
    decimals: [12],
    standardAccount: '*25519',
    website: 'https://acala.network/',
    relayChain: 'polkadot',
    paraId: 2000,
    icon: 'acala',
    isTestnet: false,
  },
  {
    prefix: 8,
    network: 'karura',
    displayName: 'Karura',
    symbols: ['KAR'],
    supportedSymbols: [],
    decimals: [12],
    standardAccount: '*25519',
    website: 'https://karura.network/',
    relayChain: 'kusama',
    paraId: 2000,
    icon: 'karura',
    isTestnet: true,
  },
  {
    prefix: 1284,
    network: 'moonbeam',
    displayName: 'Moonbeam',
    symbols: ['GLMR'],
    supportedSymbols: [],
    decimals: [18],
    icon: 'mowr',
    isTestnet: false,
  },
  {
    prefix: 1285,
    network: 'moonriver',
    displayName: 'Moonriver',
    symbols: ['MOVR'],
    supportedSymbols: ['MOVR', 'xcKAR', 'xcKSM', 'xcAUSD'], //symbol, decimals, contract address & icon
    decimals: [18],
    icon: 'mowr',
    isTestnet: true,
  },
  {
    prefix: 1287,
    network: 'moonbaseAlpha',
    displayName: 'Moonbase Alpha',
    symbols: ['DEV'],
    supportedSymbols: [
      'KSMmb',
      'WBTCmb',
      'WETHmb',
      'DAImb',
      'USDCmb',
      'MOWRmb',
    ], //symbol, decimals, contract address & icon
    decimals: [18],
    icon: 'mowr',
    isTestnet: true,
  },
] as const

export type SupportedNetwork = typeof NetworkRegistry[number]

export const supportedChainIds: number[] = Object.values(NetworkRegistry).map(
  value => Number(value),
)

export const isSupportedNetwork = (paraId: number): boolean =>
  supportedChainIds.includes(paraId)

export const getNetworkByChain = (
  chainId: SupportedNetwork['prefix'],
): SupportedNetwork | undefined => {
  return NetworkRegistry.find(network => network.prefix === chainId)
}

export const getNetworkByName = (
  name: SupportedNetwork['network'],
): SupportedNetwork | undefined => {
  return NetworkRegistry.find(
    network => network.network.toLocaleLowerCase() === name.toLocaleLowerCase(),
  )
}

export const networkConfig: NetworkConfigType = {
  [2004]: {
    name: 'moonbase',
    isTestnet: false,
    releyChain: 'polkadot',
  },
}

export const getNetworkName = (chainId: number): string => {
  if (networkConfig[chainId]) {
    return networkConfig[chainId].name
  }
  return 'Unknown'
}
