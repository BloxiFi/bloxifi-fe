import { ethers } from 'ethers'

export const MIN_VALUE_FOR_TRANSACTION = 0.0000001
export const MIN_HEALTH_FACTOR_VALUE = 1.01

//Ether decimals (i.e. 1 ether represents 10^18 wei)
export const ETHER_DECIMALS = 18
//USD decimals
export const USD_DECIMALS = 18
//Liquidation Threshold decimals
export const LT_DECIMALS = 4
//Max number of decimals in a fractional number
export const MAX_AMOUNT_DECIMALS = 18

//Ether scaling factor
export const SCALING_FACTOR = ethers.utils.parseUnits('1', ETHER_DECIMALS)
//Liquidation Threshold scaling factor
export const SCALING_FACTOR_LT = ethers.utils.parseUnits('1', LT_DECIMALS)
//Scale max available to borrow amount for AVAILABLE_BORROW_SCALING_AMOUNT (percentage)
export const AVAILABLE_BORROW_DEVIATION = '0.01'

//Regex Patterns
//Allow positive fractional number, included zero.(e.g. 0, 1, 0.0, 0.1, 1.0, 99999.000001, 5.10 )
export const PATTERN_NUMBERS_ONLY = /^[0-9]*\.?[0-9]*$/

export const configAssets = {
  KSMmb: {
    underlyingAsset: '0x16db4d26b6bab2a3d17d05f411d0170abb3374ab',
    fullName: 'Kusama',
    icon: 'ksm',
    decimals: 18,
    aToken: {
      id: '0xf160bd6a83516c70e9486c5a541fb684cbada671',
      underlyingAssetDecimals: 18,
    },
  },
  WBTCmb: {
    underlyingAsset: '0x391aa0bea0b1f3b3f82263b3c4ab1a0dcd58fb63',
    fullName: 'Wrapped Bitcoin',
    icon: 'wbtc',
    decimals: 18,
    aToken: {
      id: '0x6f0560c011df8e9ee7f58ab537315bdfb5e14fb5',
      underlyingAssetDecimals: 18,
    },
  },
  DAImb: {
    underlyingAsset: '0x425c0a54430b28f831a810fbc91fc0d33a45d67b',
    fullName: 'DAI',
    icon: 'dai',
    decimals: 18,
    aToken: {
      id: '0xdfc17928f7030ff6834b4e38b505a542b5dcc5b6',
      underlyingAssetDecimals: 18,
    },
  },
  WETHmb: {
    underlyingAsset: '0x632a2b6128319c65461a84907dfaaa72a38590ab',
    fullName: 'Wrapped Ethereum',
    icon: 'weth',
    decimals: 18,
    aToken: {
      id: '0xb777da4e5534ac384e091f9f852c39527cdff117',
      underlyingAssetDecimals: 18,
    },
  },
  USDCmb: {
    underlyingAsset: '0xa60669f4e3378af9bdde03fb78f2c08fd92a4cdb',
    fullName: 'USD Coin',
    icon: 'usdc',
    decimals: 18,
    aToken: {
      id: '0x6965942c28da13ed9979570262de7faa5c336f5b',
      underlyingAssetDecimals: 18,
    },
  },
  MOWRmb: {
    underlyingAsset: '0xbb8ade4e87048549be8a3a856d3c55e58f610197',
    fullName: 'Moonriver',
    icon: 'mowr',
    decimals: 18,
    aToken: {
      id: '0x14a8552e6af12d6cd8e86012ee47641055dcb65a',
      underlyingAssetDecimals: 18,
    },
  },
}
//@TODO UPLOAD & UPDATE ICONS
export const NetworkRegistry = [
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
    configAssets: {},
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
    configAssets: {},
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
    configAssets: {},
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
    configAssets: {},
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
    configAssets: {},
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
    configAssets: {},
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
    configAssets,
  },
] as const

export type SupportedNetwork = typeof NetworkRegistry[number]

export const supportedChainIds: number[] = Object.values(NetworkRegistry).map(
  value => Number(value),
)

export const isSupportedNetwork = (paraId: number): boolean =>
  supportedChainIds.includes(paraId)

export const getNetworkByChain = (
  chainId: number,
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

export const getNetworkName = (chainId: number): string => {
  const network = getNetworkByChain(chainId)
  if (network) {
    return network.displayName
  }
  return 'Unknown'
}

export const getNetworkConfigAssets = (chainId: number): any => {
  const network: SupportedNetwork = getNetworkByChain(chainId)
  if (network) {
    return network.configAssets
  }
  return {}
}
